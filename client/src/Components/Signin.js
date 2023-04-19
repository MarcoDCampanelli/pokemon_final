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

  const { currentUser, setCurrentUser } = useContext(UserContext);
  // State used in the POST request
  const [returningUser, setReturningUser] = useState(signin);
  // Holds the error in order to display it to the user
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
          // This will store the currentUser into localStorage so it won't be lost on every reload
          window.localStorage.setItem(
            "currentUser",
            JSON.stringify(resData.data)
          );
          // This sets the current user
          setCurrentUser(resData.data);
          // Upon sign-in, navigate to the homePage
          navigate("/");
        } else {
          // Stores errors returned by the server
          setError(resData.message);
        }
      })
      .catch((err) => navigate("/error"));
  };

  // If the user is signed in, they can't return to this page
  if (currentUser) {
    navigate("/");
  }

  return (
    <SigninContainer>
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
      {error ? <ErrorMessage>{error}</ErrorMessage> : <></>}
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
  margin: 2rem auto;
  padding: 0.5rem;
  border: 0.1rem solid gray;
  border-radius: 5px;
  background-image: linear-gradient(to bottom, #f2ebde, #ffffff);

  @media (max-width: 768px) {
    width: 60%;
  }
`;

// Container that holds individual labels and inputs
const InfoContainer = styled.div`
  margin: 1rem 0;
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
  margin: 1rem auto;
  padding: 0.5rem;
  border-radius: 5px;
  overflow: hidden;
  background-image: linear-gradient(to right, #9acbed, #217ebc);

  &:hover {
    color: white;
    background-image: linear-gradient(to right, #217ebc, #033a5e);
  }

  @media (max-width: 768px) {
    width: 50%;
  }
`;

// Styling for the box displaying the possible errors from the server
const ErrorMessage = styled.div`
  margin: 0.5rem auto;
  padding: 1rem;
  border-left: 0.2rem solid red;
`;
