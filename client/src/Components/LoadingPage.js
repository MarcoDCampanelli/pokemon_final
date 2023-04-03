import Pokeball from "../assets/Pokeball.webp";

import styled, { keyframes } from "styled-components";

const LoadingPage = () => {
  return (
    <Container>
      <Image src={Pokeball} />
    </Container>
  );
};

export default LoadingPage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 2rem;
`;

const Rotation = keyframes`
  0% {
    rotate: 0deg;
  }
  50% {
    rotate: 180deg;
  }
  100% {
    rotate: 360deg;
  }
`;

const Image = styled.img`
  position: absolute;
  top: 50%;
  width: 10%;
  animation-name: ${Rotation};
  animation-duration: 3s;
  animation-iteration-count: infinite;
`;
