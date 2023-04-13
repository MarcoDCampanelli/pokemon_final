import { Link } from "react-router-dom";

import cryingPikachu from "../assets/crying pikachu.gif";

import styled from "styled-components";

// This component renders an error page when the pokemon/attack/ability being search doesn't exist or if an error occurs elsewhere
const ErrorPage = () => {
  return (
    <Container>
      <p>Sorry, we are unable to find what you were looking for...</p>
      <Image src={cryingPikachu} alt={"Crying pikachu"} />
      <span>
        Please return to the <Link to={"/"}>Home Page</Link> and try again.
      </span>
    </Container>
  );
};

export default ErrorPage;

// Container holding the message, link back to home and the crying pikachu gif
const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 3rem auto;
`;

// Styling for the pikachu gif
const Image = styled.img`
  margin: 2rem auto;
  width: 20%;

  @media (max-width: 768px) {
    width: 30%;
  }
`;
