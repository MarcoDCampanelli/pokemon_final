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
          <h3>Don't have an account?</h3>
          <Button onClick={() => setAccount(false)}>Register</Button>
        </LogInContainer>
      ) : (
        <LogInContainer>
          <Registration />
          <h3>Already have an account?</h3>
          <Button onClick={() => setAccount(true)}>Sign In</Button>
        </LogInContainer>
      )}
    </>
  );
};

export default Login;

const LogInContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

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
