import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

import styled from "styled-components";

const Registration = () => {
  const registration = {
    user: "",
    password: "",
    email: "",
  };

  const { setCurrentUser } = useContext(UserContext);
  const [newUser, setNewUser] = useState(registration);

  const handleRegistration = (e) => {
    e.preventDefault();

    fetch("/createUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((resData) => {
        window.localStorage.setItem(
          "currentUser",
          JSON.stringify(resData.data)
        );
        setCurrentUser(resData.data);
      });
  };

  return (
    <SigninContainer>
      <h1>Register</h1>
      <Form onSubmit={handleRegistration}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setNewUser({ ...newUser, user: e.target.value })}
          ></input>
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          ></input>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="example@email.com"
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          ></input>
        </div>
        <button type="submit" onClick={handleRegistration}>
          Register
        </button>
      </Form>
    </SigninContainer>
  );
};

export default Registration;

const SigninContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  text-align: right;
  margin: auto;
  background-color: red;
`;
