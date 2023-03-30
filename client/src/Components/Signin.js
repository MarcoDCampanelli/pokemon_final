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
  const [error, setError] = useState("");
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
          setError(resData.message);
        }
      });
  };

  return (
    <SigninContainer>
      <h1>Sign In</h1>
      <Form onSubmit={handleSignIn}>
        <InfoContainer>
          <Label>Username:</Label>
          <Inputs
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setReturningUser({ ...returningUser, user: e.target.value })
            }
          ></Inputs>
        </InfoContainer>
        <InfoContainer>
          <Label>Email:</Label>
          <Inputs
            type="email"
            placeholder="example@email.com"
            onChange={(e) =>
              setReturningUser({ ...returningUser, email: e.target.value })
            }
          ></Inputs>
        </InfoContainer>
        <InfoContainer>
          <Label>Password:</Label>
          <Inputs
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setReturningUser({ ...returningUser, password: e.target.value })
            }
          ></Inputs>
        </InfoContainer>
        <Button type="submit" onClick={handleSignIn}>
          Log In
        </Button>
      </Form>
      <ErrorMessage>{error}</ErrorMessage>
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
  width: 40%;
  text-align: right;
  margin: auto;
  padding: 0.5rem;
  border: 0.1rem solid gray;
  border-radius: 5px;
`;

// Container that holds individual labels and inputs
const InfoContainer = styled.div`
  margin: 0.5rem 0;
`;

// Styling for the labels
const Label = styled.label`
  margin: 0rem 0.5rem;
  font-weight: bold;
`;

// Stylings for the inputs
const Inputs = styled.input`
  margin-right: 2rem;
  width: 50%;
  padding: 0.5rem;

  @media (max-width: 768px) {
    width: 25%;
  }
`;

// Styling for the button
const Button = styled.button`
  width: 20%;
  margin: 2rem auto;
  padding: 0.5rem;
  border-radius: 5px;
  overflow: hidden;

  &:hover {
    color: white;
    background-color: lightblue;
  }

  @media (max-width: 768px) {
    width: 50%;
  }
`;

// Styling for the box displaying the possible responses from the server
const ErrorMessage = styled.div`
  margin: 0.5rem auto;
  padding: 1rem;
`;
