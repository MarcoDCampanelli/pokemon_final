import { Link } from "react-router-dom";

import styled from "styled-components";

const Footer = () => {
  return (
    <Container>
      <Link to={"/natures"}>Natures</Link>
    </Container>
  );
};

export default Footer;

const Container = styled.div`
  padding: 0 2rem;
  height: 10vh;
  border-top: 0.2rem solid black;
`;
