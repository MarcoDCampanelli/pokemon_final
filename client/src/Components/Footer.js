import { NavLink } from "react-router-dom";

import styled from "styled-components";

// This component renders the footer so that it appears on every page
const Footer = () => {
  return (
    <Container>
      <Link to={"/natures"}>Natures</Link>
      <Link to={"/items"}>Item List</Link>
      <Link to={"/abilities"}>Ability List</Link>
      <Link to={"/eggGroups"}>Egg Group List</Link>
    </Container>
  );
};

export default Footer;

// Container that holds all of the links in the footer
const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  border-top: 0.1rem solid black;
`;

// Links to various pages
const Link = styled(NavLink)`
  text-decoration: underline;
  color: black;
  margin: 0.5rem auto;

  &.active {
    color: blue;
  }
`;
