import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";

const Homepage = () => {
  const { capAndRemoveHyphen } = useContext(UserContext);
  const navigate = useNavigate();
  // The first 3 states are used for Pagination
  const [pokemonList, setPokemonList] = useState("");
  const [offset, setOffset] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(50);
  // The following states are used in the search bars
  const [pokemon, setPokemon] = useState("");
  const [attack, setAttack] = useState("");
  const [ability, setAbility] = useState("");

  // This endpoint is used from the PokeAPI to grab a list of all Pokemon and all of their forms based off of species
  useEffect(() => {
    fetch(
      `https://pokeapi.co/api/v2/pokemon-species/?offset=${offset}&limit=${postsPerPage}`
    )
      .then((res) => res.json())
      .then((resData) => {
        setPokemonList(resData.results);
      });
  }, [offset]);

  const handlePokemonSearch = () => {
    if (pokemon.length > 0) {
      navigate(`/pokemon/${pokemon.replaceAll(" ", "-")}`);
    }
  };

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
            onChange={(e) => setPokemon(e.target.value.toLowerCase())}
          ></Inputs>
          <SearchButton
            onClick={() => {
              handlePokemonSearch();
            }}
          >
            Search
          </SearchButton>
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
            disabled={offset === 0}
            onClick={() => {
              setOffset(offset - postsPerPage);
            }}
          >
            Previous
          </Button>
          <Button
            disabled={pokemonList.length < postsPerPage}
            onClick={() => {
              setOffset(offset + postsPerPage);
            }}
          >
            Next
          </Button>
        </ButtonContainer>
        <PokemonContainer>
          {pokemonList.map((pokemon, index) => {
            return (
              <IndividualPokemonContainer key={index}>
                <PokemonName to={`/pokemon/${pokemon.name}`}>
                  {capAndRemoveHyphen(pokemon.name)}
                </PokemonName>
                <Sprite
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                    index + 1 + offset
                  }.png`}
                />
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
const PokemonName = styled(Link)`
  display: block;
  text-decoration: none;
  font-weight: bold;
  color: black;

  &:hover {
    color: lightblue;
  }
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
