import Pokeball from "../assets/Pokeball.webp";
import Pikachu from "../assets/running pikachu.gif";

import styled, { keyframes } from "styled-components";

const LoadingPage = () => {
  return (
    <Container>
      <PikachuImage src={Pikachu} />
      <Image src={Pokeball} />
      <PikachuImage src={Pikachu} />
    </Container>
  );
};

export default LoadingPage;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  position: absolute;
  top: 40%;
`;

const Rotation = keyframes`
  0% {
    rotate: 0deg;
  }
  100% {
    rotate: 360deg;
  }
`;

const PikachuImage = styled.img`
  width: 10%;
`;

const Image = styled.img`
  width: 10%;
  animation-name: ${Rotation};
  animation-duration: 3s;
  animation-iteration-count: infinite;
`;
