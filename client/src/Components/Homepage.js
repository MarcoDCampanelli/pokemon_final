import { useState, useEffect } from "react";

import styled from "styled-components";

const Homepage = () => {
  // The first 4 states are used for Pagination
  const [pokemonList, setPokemonList] = useState("");
  const [offset, setOffset] = useState(0);
  const [oddOne, setOddOne] = useState(null);
  const [postsPerPage, setPostsPerPage] = useState(42);
  // The following states are used in the search bars
  const [pokemon, setPokemon] = useState("");
  const [attack, setAttack] = useState("");
  const [ability, setAbility] = useState("");

  // This endpoint is used from the PokeAPI to grab a list of all Pokemon and all of their forms
  useEffect(() => {
    fetch(
      `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${postsPerPage}`
    )
      .then((res) => res.json())
      .then((resData) => {
        setPokemonList(resData.results);
      });
  }, [offset]);

  if (!pokemonList) {
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
            // The numbers were chosen for specific reasons: 42 makes it so that it ends on the last pokemon of the dex.
            // After this points, the forms are stored in different endpoints so a second state is created to account for the new url. The state only becomes active after all pokemon have been listed.
            disabled={offset === 0}
            onClick={() => {
              setOffset(offset - 42);
              if (offset < 966) {
                setOddOne(0);
              }
              if (oddOne > 0) {
                setOddOne(oddOne - 1);
              }
            }}
          >
            Previous
          </Button>
          <Button
            disabled={pokemonList.length < 42}
            onClick={() => {
              setOffset(offset + 42);
              if (offset === 966) {
                setOddOne(0);
              }
              if (oddOne >= 0 && offset > 966) {
                setOddOne(oddOne + 1);
              }
            }}
          >
            Next
          </Button>
        </ButtonContainer>
        <PokemonContainer>
          {pokemonList.map((pokemon, index) => {
            return (
              <IndividualPokemonContainer key={index}>
                <PokemonName>
                  {pokemon.name
                    .replaceAll("-", " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </PokemonName>
                {/* Ternery is necessary for way API is set up. Alternate forms no longer follow the usual img url. Instead they jump to 10000. Therefore, a second state was created to account for this */}
                {offset < 968 ? (
                  <Sprite
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                      index + 1 + offset
                    }.png`}
                  />
                ) : (
                  <Sprite
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                      9999 + index + oddOne * postsPerPage
                    }.png`}
                    alt={"Not available"}
                  />
                )}
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
  width: 40%;
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
