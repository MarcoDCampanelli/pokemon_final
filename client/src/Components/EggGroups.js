import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";

const EggGroups = () => {
  const { capAndRemoveHyphen } = useContext(UserContext);
  const [eggGroupsList, setEggGroupsList] = useState("");

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/egg-group/")
      .then((res) => res.json())
      .then((resData) => setEggGroupsList(resData));
  }, []);

  if (!eggGroupsList) {
    return <></>;
  }

  eggGroupsList.results.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <EggGroupsContainer>
      <Title>Egg Groups:</Title>
      {eggGroupsList.results.map((group) => {
        return (
          <EggGroupLink to={`/eggGroups/${group.name}`}>
            {capAndRemoveHyphen(group.name)}
          </EggGroupLink>
        );
      })}
    </EggGroupsContainer>
  );
};

export default EggGroups;

const EggGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Title = styled.h1`
  margin: 1rem auto;
  font-weight: bold;
`;

// Link to the pokemon's page when clicked
const EggGroupLink = styled(Link)`
  text-decoration: none;
  color: black;
  border: 0.1rem solid black;
  border-radius: 5px;
  margin: 0.25rem;
  padding: 0.5rem;
  margin: 0.2rem auto;
  width: 20%;

  &:hover {
    background-color: lightblue;
  }
`;
