import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

import styled from "styled-components";

// This components contains the code for the user to signin if they already have an account
const Signin = () => {
  const signin = {
    user: "",
    email: "",
    password: "",
  };

  const { setCurrentUser } = useContext(UserContext);
  const [returningUser, setReturningUser] = useState(signin);
  const navigate = useNavigate();

  // POST request in order to verify information in order to sign in
  const handleSignIn = (e) => {
    e.preventDefault();

    fetch("/signinUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(returningUser),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === 200) {
          window.localStorage.setItem(
            "currentUser",
            JSON.stringify(resData.data)
          );
          setCurrentUser(resData.data);
          navigate("/");
        } else {
          window.alert(resData.message);
        }
      });
  };

  return (
    <SigninContainer>
      <h1>Login</h1>
      <Form onSubmit={handleSignIn}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setReturningUser({ ...returningUser, user: e.target.value })
            }
          ></input>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="example@email.com"
            onChange={(e) =>
              setReturningUser({ ...returningUser, email: e.target.value })
            }
          ></input>
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setReturningUser({ ...returningUser, password: e.target.value })
            }
          ></input>
        </div>
        <button type="submit" onClick={handleSignIn}>
          Log in
        </button>
      </Form>
    </SigninContainer>
  );
};

export default Signin;

// Container for the entire page
const SigninContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// Styling for the form
const Form = styled.form`
  display: flex;
  flex-direction: column;
  text-align: right;
  margin: auto;
  background-color: red;
`;
