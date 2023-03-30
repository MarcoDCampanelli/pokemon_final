import { useState, useEffect } from "react";

import styled from "styled-components";

const Homepage = () => {
  const [pokemon, setPokemon] = useState("");
  const [loading, setLoading] = useState("idle");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(51);

  useEffect(() => {
    setLoading("loading");
    let pokemonPromiseList = [];
    for (let i = currentPage; i < postsPerPage; i++) {
      pokemonPromiseList.push(
        fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`)
          .then((res) => res.json())
          .then((resData) => {
            return [
              resData.name
                .replace("-", " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              resData.sprites.front_default,
            ];
          })
      );
    }
    Promise.all(pokemonPromiseList).then((data) => setPokemon(data));
    setLoading("idle");
  }, [currentPage]);

  console.log(pokemon);

  if (!pokemon || loading === "loading") {
    return <>Loading...</>;
  }

  return (
    <>
      <ButtonContainer>
        <Button
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage(currentPage - 50);
            setPostsPerPage(postsPerPage - 50);
          }}
        >
          Previous
        </Button>
        <Button
          disabled={pokemon.length < 50}
          onClick={() => {
            setCurrentPage(currentPage + 50);
            setPostsPerPage(postsPerPage + 50);
          }}
        >
          Next
        </Button>
      </ButtonContainer>
      <PokemonContainer>
        {pokemon.map((monster) => {
          return (
            <IndividualPokemonContainer>
              <PokemonName>{monster[0]}</PokemonName>
              <Sprite src={monster[1]} />
            </IndividualPokemonContainer>
          );
        })}
      </PokemonContainer>
    </>
  );
};

export default Homepage;

const ButtonContainer = styled.div`
  margin: 0.5rem;
  display: flex;
  justify-content: space-between;
`;

// This is the container for the list of pokemon being paginated
const PokemonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 1rem;
`;

// Container for the individual pokemon
const IndividualPokemonContainer = styled.div`
  text-align: center;
  width: 10%;
  border: 2px solid black;
  margin: 0.2rem auto;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 20%;
  }

  @media (max-width: 480px) {
    width: 25%;
  }
`;

// Styled image of the sprite of the pokemon
const Sprite = styled.img`
  width: 50%;
`;

// Styled name of the pokemon
const PokemonName = styled.p`
  font-weight: bold;
`;

// Styling for the button
const Button = styled.button`
  width: 20%;
  margin: 2rem auto;
  padding: 0.5rem;
  border-radius: 5px;
  overflow: hidden;

  &:hover {
    color: white;
    background-color: lightblue;
  }
`;
