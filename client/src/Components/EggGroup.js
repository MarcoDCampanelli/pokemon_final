import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

// This component will render a list of all pokemon that belong to the chosen egg group
const EggGroup = () => {
  const group = useParams();
  const { capAndRemoveHyphen } = useContext(UserContext);
  const [eggGroup, setEggGroup] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/egg-group/${group.group}`)
      .then((res) => res.json())
      .then((resData) => setEggGroup(resData))
      .catch((err) => navigate("/error"));
  }, [group]);

  if (!eggGroup) {
    return <LoadingPage />;
  }

  return (
    <Container>
      <Title>{capAndRemoveHyphen(eggGroup.name)}</Title>
      <PokemonContainer>
        {eggGroup.pokemon_species.map((pokemon) => {
          return (
            <PokemonLink
              to={`/pokemon/${pokemon.name}`}
              key={`EggGroup:${pokemon.name}`}
            >
              {capAndRemoveHyphen(pokemon.name)}
            </PokemonLink>
          );
        })}
      </PokemonContainer>
    </Container>
  );
};

export default EggGroup;

// Container for the entire page
const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// Container for the entire page
const Title = styled.h1`
  margin: 1rem auto;
  font-weight: bold;
`;

// Container holding all of the links
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
    background-color: lightblue;
  }

  /* On smaller screens increase size so that it's more visible */
  @media (max-width: 768px) {
    width: 40%;
  }
`;
