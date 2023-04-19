import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

const ResetPassword = () => {
  const signin = {
    user: "",
    email: "",
    password: "",
    passwordRepeat: "",
  };

  const [resetUser, setResetUser] = useState(signin);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();

    fetch("/resetPassword", {
      method: "PATCH",
      body: JSON.stringify(resetUser),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resData) => setError(resData))
      .catch((error) => navigate("/error"));
  };

  return (
    <SigninContainer>
      <Form onSubmit={handleReset}>
        <InfoContainer>
          <Label>Username:</Label>
          <Inputs
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setResetUser({ ...resetUser, user: e.target.value })
            }
          ></Inputs>
        </InfoContainer>
        <InfoContainer>
          <Label>Email:</Label>
          <Inputs
            type="email"
            placeholder="example@email.com"
            onChange={(e) =>
              setResetUser({ ...resetUser, email: e.target.value })
            }
          ></Inputs>
        </InfoContainer>
        <InfoContainer>
          <Label>Password:</Label>
          <Inputs
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setResetUser({ ...resetUser, password: e.target.value })
            }
          ></Inputs>
        </InfoContainer>
        <InfoContainer>
          <Label>Password:</Label>
          <Inputs
            type="password"
            placeholder="Confirm Password"
            onChange={(e) =>
              setResetUser({ ...resetUser, passwordRepeat: e.target.value })
            }
          ></Inputs>
        </InfoContainer>
        <Button type="submit" onClick={handleReset}>
          Reset Password
        </Button>
      </Form>
      {error ? (
        <ErrorMessage error={error.status > 299}>{error.message}</ErrorMessage>
      ) : (
        <></>
      )}
    </SigninContainer>
  );
};

export default ResetPassword;

// Container for the entire page
const SigninContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 85vh;
  background-color: #fff4dc;
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

  border-left: ${(props) =>
    props.error ? "0.2rem solid red" : "0.2rem solid green"};
`;
