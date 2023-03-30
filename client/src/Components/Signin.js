import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

import styled from "styled-components";

const Signin = () => {
  const signIn = {
    user: "",
    password: "",
    email: "",
  };

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [user, setUser] = useState(signIn);

  const handleRegistration = (e) => {
    e.preventDefault();

    fetch("/createUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signIn),
    })
      .then((res) => res.json())
      .then((resData) => {
        window.localStorage.setItem("currentUser", JSON.stringify(user.user));
        console.log(resData);
      });
  };

  console.log(user);

  return (
    <SigninContainer>
      <h1>Register</h1>
      <Form onSubmit={handleRegistration}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUser({ ...user, user: e.target.value })}
          ></input>
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          ></input>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="example@email.com"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          ></input>
        </div>
        <button type="submit" onClick={handleRegistration}>
          Register
        </button>
      </Form>
    </SigninContainer>
  );
};

export default Signin;

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
