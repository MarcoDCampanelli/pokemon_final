import { NavLink } from "react-router-dom";

import styled from "styled-components";

const Footer = () => {
  return (
    <Container>
      <Link to={"/natures"}>Natures</Link>
      <Link to={"/items"}>Item List</Link>
    </Container>
  );
};

export default Footer;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 10vh;
  border-top: 0.2rem solid black;
`;

const Link = styled(NavLink)`
  text-decoration: none;
  color: black;
  margin: 0.2rem 1rem;

  &.active {
    color: blue;
  }
`;
