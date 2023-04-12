import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";

const EggGroup = () => {
  const group = useParams();
  const { capAndRemoveHyphen, nameExceptions } = useContext(UserContext);
  const [eggGroup, setEggGroup] = useState("");

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/egg-group/${group.group}`)
      .then((res) => res.json())
      .then((resData) => setEggGroup(resData));
  }, []);

  if (!eggGroup) {
    return <></>;
  }

  console.log(eggGroup);

  return (
    <Container>
      <Title>{capAndRemoveHyphen(eggGroup.name)}</Title>
      <PokemonContainer>
        {eggGroup.pokemon_species.map((pokemon) => {
          return (
            <PokemonLink to={`/pokemon/${pokemon.name}`}>
              {capAndRemoveHyphen(pokemon.name)}
            </PokemonLink>
          );
        })}
      </PokemonContainer>
    </Container>
  );
};

export default EggGroup;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Title = styled.h1`
  margin: 1rem auto;
  font-weight: bold;
`;

const PokemonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// Link to the pokemon's page when clicked
const PokemonLink = styled(Link)`
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
