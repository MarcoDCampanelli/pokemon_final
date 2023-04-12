import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";

const Ability = () => {
  const ability = useParams();
  const { capAndRemoveHyphen, nameExceptions } = useContext(UserContext);
  const [abilities, setAbilities] = useState("");

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/ability/${ability.ability}`)
      .then((res) => res.json())
      .then((resData) => setAbilities(resData));
  }, []);

  let allPokemon = [];
  if (abilities) {
    abilities.pokemon.map((pokemon) => {
      let array = pokemon.pokemon.name.split("-");
      let exceptions = nameExceptions.some((item) => array.includes(item));
      if (exceptions) {
        allPokemon.push(pokemon.pokemon.name.split("-")[0]);
      } else {
        allPokemon.push(pokemon.pokemon.name);
      }
    });
  }
  let uniquePokemon = [...new Set(allPokemon)];

  if (!abilities) {
    return <></>;
  }

  return (
    <Container>
      <Title>{capAndRemoveHyphen(abilities.name)}</Title>
      <div>
        <Title>Ability Description:</Title>
        {abilities.effect_entries.map((entry) => {
          if (entry.language.name === "en") {
            return <Description>{entry.effect}</Description>;
          }
        })}
      </div>
      <Title>Pokemon with this Ability:</Title>
      <PokemonContainer>
        {uniquePokemon.length > 0 &&
          uniquePokemon.map((pokemon) => {
            return (
              <PokemonLink to={`/pokemon/${pokemon}`}>
                {capAndRemoveHyphen(pokemon)}
              </PokemonLink>
            );
          })}
      </PokemonContainer>
    </Container>
  );
};

export default Ability;

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

const Description = styled.div`
  width: 60%;
  margin: auto;
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
