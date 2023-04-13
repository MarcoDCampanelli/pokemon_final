import Pokeball from "../assets/Pokeball.webp";
import Pikachu from "../assets/running pikachu.gif";

import styled, { keyframes } from "styled-components";

// This component renders the loading screen during fetches
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

// This holds the entire page
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  margin: 10rem 0;
`;

// This is the animation being used for the Pokeball
const Rotation = keyframes`
  0% {
    rotate: 0deg;
  }
  100% {
    rotate: 360deg;
  }
`;

// Styling for the pikachus who are running (gifs)
const PikachuImage = styled.img`
  width: 10%;
`;

// Styling for the Pokeball in the center in order to make it spin indefinitely
const Image = styled.img`
  width: 10%;
  animation-name: ${Rotation};
  animation-duration: 3s;
  animation-iteration-count: infinite;
`;
