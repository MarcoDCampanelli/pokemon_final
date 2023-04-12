import { useState } from "react";

import Registration from "./Registration";
import Signin from "./Signin";

import styled from "styled-components";

// This components holds both the SignIn and Register options for the users of the website
const Login = () => {
  const [account, setAccount] = useState(true);

  return (
    <>
      {account ? (
        <LogInContainer>
          <Signin />
          <Question>Don't have an account?</Question>
          <Button onClick={() => setAccount(false)}>Register</Button>
        </LogInContainer>
      ) : (
        <LogInContainer>
          <Registration />
          <Question>Already have an account?</Question>
          <Button onClick={() => setAccount(true)}>Sign In</Button>
        </LogInContainer>
      )}
    </>
  );
};

export default Login;

// Container for the entire page including the form and the button to go to registration or sign-in
const LogInContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// Styling for the button
const Button = styled.button`
  width: 20%;
  margin: auto;
  padding: 0.5rem;
  border-radius: 5px;
  overflow: hidden;

  &:hover {
    color: white;
    background-color: lightblue;
  }
`;

// Styling for the question of whether the user has or doesn't have an account
const Question = styled.h3`
  margin: 0.5rem;
`;
