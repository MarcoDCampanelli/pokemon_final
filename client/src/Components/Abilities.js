import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";

const Abilities = () => {
  const { capAndRemoveHyphen } = useContext(UserContext);
  const [abilityList, setAbilityList] = useState("");

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/ability?offset=0&limit=298")
      .then((res) => res.json())
      .then((resData) => setAbilityList(resData));
  }, []);

  if (!abilityList) {
    return <></>;
  }

  abilityList.results.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <AbilityContainer>
      <Title>Abilities</Title>
      {abilityList.results.map((ability) => {
        return (
          <AbilityLink to={`/abilities/${ability.name}`}>
            {capAndRemoveHyphen(ability.name)}
          </AbilityLink>
        );
      })}
    </AbilityContainer>
  );
};

export default Abilities;

const AbilityContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Title = styled.h1`
  margin: 1rem auto;
  font-weight: bold;
`;

// Link to the pokemon's page when clicked
const AbilityLink = styled(Link)`
  text-decoration: underline;
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
