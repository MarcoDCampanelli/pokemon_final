import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

// This component will render the page for a specific ability
const Ability = () => {
  const ability = useParams();
  const { capAndRemoveHyphen, nameExceptions } = useContext(UserContext);
  const [abilities, setAbilities] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/ability/${ability.ability}`)
      .then((res) => res.json())
      .then((resData) => setAbilities(resData))
      .catch((err) => navigate("./error"));
  }, [ability]);

  // This will filter out the pokemon who have special forms and only return then species who can have this ability to avoid confusion. It will also only return a list of unique values
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
    return <LoadingPage />;
  }

  return (
    <Container>
      <Title>{capAndRemoveHyphen(abilities.name)}</Title>
      <div>
        <Title>Ability Description:</Title>
        {abilities.effect_entries.map((entry) => {
          if (entry.language.name === "en") {
            return <Description key={entry.effect}>{entry.effect}</Description>;
          }
        })}
      </div>
      <Title>Pokemon with this Ability:</Title>
      <PokemonContainer>
        {uniquePokemon.length > 0 &&
          uniquePokemon.map((pokemon) => {
            return (
              <PokemonLink
                to={`/pokemon/${pokemon}`}
                key={`SpecificPokeAbility:${pokemon}`}
              >
                {capAndRemoveHyphen(pokemon)}
              </PokemonLink>
            );
          })}
      </PokemonContainer>
    </Container>
  );
};

export default Ability;

// Container for the entire page
const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// Styling for the title
const Title = styled.h1`
  margin: 1rem auto;
  font-weight: bold;
`;

// Styling for the description of the ability
const Description = styled.div`
  width: 60%;
  margin: auto;
`;

// Container for the links of the pokemon with this ability
const PokemonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// Link to the pokemon's page when clicked
const PokemonLink = styled(Link)`
  text-decoration: none;
  color: black;
  border: 0.1rem solid grey;
  border-radius: 5px;
  padding: 0.5rem;
  margin: 0.2rem auto;
  width: 20%;

  &:hover {
    color: white;
    background-image: linear-gradient(to right, #217ebc, #033a5e);
  }

  /* On smaller screens increase size so that it's more visible */
  @media (max-width: 768px) {
    width: 40%;
  }
`;
