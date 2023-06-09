import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

// This component will generate a list of the egg groups in pokemon
const EggGroups = () => {
  const { capAndRemoveHyphen } = useContext(UserContext);
  const [eggGroupsList, setEggGroupsList] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/egg-group/")
      .then((res) => res.json())
      .then((resData) => setEggGroupsList(resData))
      .catch((err) => navigate("/error"));
  }, []);

  if (!eggGroupsList) {
    return <LoadingPage />;
  }

  // This will place the egg groups in alphabetical order
  eggGroupsList.results.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <EggGroupsContainer>
      <Title>Egg Groups:</Title>
      <Paragraph>
        Every Pokemon belongs to at least one egg group. Pokemon in the same egg
        group can breed and will produce an offspring of the same species as the
        mother, unless one of the Pokemon is Ditto, in which case the offspring
        will be of the same species as the other Pokemon. Some Pokemon belong to
        multiple egg groups. Pokemon who cannot breed, belong to the No Eggs
        group.
      </Paragraph>
      <Background>
        {eggGroupsList.results.map((group) => {
          return (
            <EggGroupLink to={`/eggGroups/${group.name}`} key={group.name}>
              {capAndRemoveHyphen(group.name)}
            </EggGroupLink>
          );
        })}
      </Background>
    </EggGroupsContainer>
  );
};

export default EggGroups;

// Container for the entire page
const EggGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// Container for the entire page
const Title = styled.h1`
  font-size: 2rem;
  margin: 2rem 0;
  text-align: center;
`;

// Paragraph explaining how EggGroups work
const Paragraph = styled.p`
  width: 70%;
  margin: 2rem auto;
  line-height: 3vh;
`;

const Background = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  background-color: #dbdbdb;
`;

// Link to the pokemon's page when clicked
const EggGroupLink = styled(Link)`
  text-decoration: none;
  color: black;
  border: 0.1rem solid grey;
  border-radius: 5px;
  padding: 0.5rem;
  margin: 0.2rem auto;
  width: 20%;
  background-color: white;

  &:hover {
    color: white;
    background-image: linear-gradient(to right, #217ebc, #033a5e);
  }

  /* On smaller screens increase size so that it's more visible */
  @media (max-width: 768px) {
    width: 40%;
  }
`;
