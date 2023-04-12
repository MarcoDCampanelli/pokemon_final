import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

import styled from "styled-components";

// This component allows the user to register a new account
const Registration = () => {
  const registration = {
    user: "",
    password: "",
    email: "",
  };

  const { setCurrentUser } = useContext(UserContext);
  // State used to hold the new user's info
  const [newUser, setNewUser] = useState(registration);
  // State used to hold any errors the server may respond with
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // POST request in order to create a new user to the Users collection
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
        if (resData.status === 201) {
          // Stores the new user in local storage
          window.localStorage.setItem(
            "currentUser",
            JSON.stringify(resData.data)
          );
          //  Sets current user to this new user
          setCurrentUser(resData.data);
          // Navigates us to the home page
          navigate("/");
        } else {
          // Stores errors returned by the server
          setError(resData.message);
        }
      })
      .catch((err) => navigate("/error"));
  };

  return (
    <SigninContainer>
      <Title>Register</Title>
      <Form onSubmit={handleRegistration}>
        <InfoContainer>
          <Label>Username:</Label>
          <Inputs
            type="text"
            placeholder="Username"
            onChange={(e) => setNewUser({ ...newUser, user: e.target.value })}
          ></Inputs>
        </InfoContainer>
        <InfoContainer>
          <Label>Email:</Label>
          <Inputs
            type="email"
            placeholder="example@email.com"
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          ></Inputs>
        </InfoContainer>
        <InfoContainer>
          <Label>Password:</Label>
          <Inputs
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          ></Inputs>
        </InfoContainer>
        <Button type="submit" onClick={handleRegistration}>
          Register
        </Button>
      </Form>
      {error ? <ErrorMessage>{error}</ErrorMessage> : <></>}
    </SigninContainer>
  );
};

export default Registration;

// Container for the entire page
const SigninContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// Title styling
const Title = styled.h1`
  margin: 0.5rem;
  font-weight: bold;
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
  border-left: 0.2rem solid red;
`;
