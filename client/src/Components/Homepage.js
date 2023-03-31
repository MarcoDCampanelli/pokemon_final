import { useState, useEffect } from "react";

import styled from "styled-components";

const Homepage = () => {
  // The first 4 states are used for Pagination
  const [pokemonList, setPokemonList] = useState("");
  const [loading, setLoading] = useState("idle");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(51);
  // The following states are used in the search bars
  const [pokemon, setPokemon] = useState("");
  const [attack, setAttack] = useState("");
  const [ability, setAbility] = useState("");

  useEffect(() => {
    setLoading("loading");
    let pokemonPromiseList = [];
    for (let i = currentPage; i < postsPerPage; i++) {
      pokemonPromiseList.push(
        fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`)
          .then((res) => res.json())
          .then((resData) => {
            if (resData) {
              try {
                return [
                  resData.name
                    .replace("-", " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
                  resData.sprites.front_default,
                ];
              } catch (err) {
                console.log(err);
              }
            }
          })
      );
    }
    Promise.all(pokemonPromiseList).then((data) => setPokemonList(data));
    setLoading("idle");
  }, [currentPage]);

  // console.log(pokemon);

  if (!pokemonList || loading === "loading") {
    return <>Loading...</>;
  }

  return (
    <>
      <HomepageContainer>
        <Title>Competitive Pokemon Builds</Title>
        <SearchContainer>
          <Label>Search Pokemon:</Label>
          <Inputs
            type="text"
            placeholder="Pokemon"
            onChange={(e) => setPokemon(e.target.value)}
          ></Inputs>
          <SearchButton>Search</SearchButton>
        </SearchContainer>
        <SearchContainer>
          <Label>Search Attack:</Label>
          <Inputs
            type="text"
            placeholder="Attack"
            onChange={(e) => setAttack(e.target.value)}
          ></Inputs>
          <SearchButton>Search</SearchButton>
        </SearchContainer>
        <SearchContainer>
          <Label>Search Ability:</Label>
          <Inputs
            type="text"
            placeholder="Ability"
            onChange={(e) => setAbility(e.target.value)}
          ></Inputs>
          <SearchButton>Search</SearchButton>
        </SearchContainer>
      </HomepageContainer>
      <div>
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
            disabled={pokemonList.length < 50}
            onClick={() => {
              setCurrentPage(currentPage + 50);
              setPostsPerPage(postsPerPage + 50);
            }}
          >
            Next
          </Button>
        </ButtonContainer>
        <PokemonContainer>
          {pokemonList.map((pokemon, index) => {
            return (
              <IndividualPokemonContainer key={index}>
                <PokemonName>{pokemon[0]}</PokemonName>
                <Sprite src={pokemon[1]} />
              </IndividualPokemonContainer>
            );
          })}
        </PokemonContainer>
      </div>
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

// Styling for the Next/Previous button
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

// Styling for the Search button
const SearchButton = styled.button`
  width: 20%;
  margin: 1rem;
  padding: 0.5rem;
  border-radius: 5px;
  overflow: hidden;

  &:hover {
    color: white;
    background-color: lightblue;
  }

  @media (max-width: 768px) {
    width: 50%;
  }
`;

// Container for the top half of the homepage
const HomepageContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// Main title
const Title = styled.h1`
  font-size: 3rem;
  margin: 1rem;
`;

// Individual search containers
const SearchContainer = styled.div`
  width: 50%;
  margin: 0.1rem auto;
  text-align: right;
  border: 0.1rem solid black;
  border-radius: 5px;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

// Styling for the labels
const Label = styled.label`
  margin: 0rem 0.5rem;
  font-weight: bold;

  @media (max-width: 768px) {
    width: 20%;
  }
`;

// Stylings for the inputs
const Inputs = styled.input`
  margin-right: 1rem;
  width: 30%;
  padding: 0.5rem;

  @media (max-width: 768px) {
    width: 25%;
  }
`;
