import cryingPikachu from "../assets/crying pikachu.gif";

import styled from "styled-components";

const ErrorPage = () => {
  return (
    <Container>
      <p>Sorry, we are unable to find what you are looking for...</p>
      <Image src={cryingPikachu} />
    </Container>
  );
};

export default ErrorPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 3rem auto;
`;

const Image = styled.img`
  margin: 1rem auto;
  width: 10%;
`;
