import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

// This component will render the homepage including the search bars and a pagination of pokemon for people who don't know the franchise.
const Homepage = () => {
  const { capAndRemoveHyphen } = useContext(UserContext);
  const navigate = useNavigate();
  // The first 3 states are used for Pagination
  const [pokemonList, setPokemonList] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(45);
  // The following states are used in the search bars
  const [pokemon, setPokemon] = useState("");
  const [attack, setAttack] = useState("");
  const [ability, setAbility] = useState("");
  //  This state is used to hold all of the suggestions while typing
  const [suggestions, setSuggestions] = useState("");

  // This will filter the pokemon that match what is being typed and add it to the suggestions state
  const filterSuggestions = (typed) => {
    const pokemonMatches = pokemonList.filter((monster) => {
      if (monster.name.includes(typed.toLowerCase())) {
        return true;
      }
    });
    setSuggestions(pokemonMatches);
  };

  // Onchange in the input, this function will be executed to generate the list. If what's being typed is only 2 characters or less, nothing is shown
  const handleSuggestions = (typed) => {
    if (typed.length > 2) {
      return filterSuggestions(typed);
    }
    if (typed.length <= 2) {
      return setSuggestions([]);
    }
  };

  // This endpoint is used from the PokeAPI to grab a list of all Pokemon and all of their forms based off of species
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=1010`)
      .then((res) => res.json())
      .then((resData) => {
        setPokemonList(resData.results);
      })
      .catch((err) => navigate("/error"));
  }, []);

  // If something is typed, regardless of caps and -, search pokemon
  const handlePokemonSearch = () => {
    if (pokemon.length > 0) {
      navigate(`/pokemon/${pokemon.replaceAll(" ", "-")}`);
    }
  };

  // If something is typed, regardless of caps and -, search attack
  const handleAttackSearch = () => {
    if (attack.length > 0) {
      navigate(`/attacks/${attack.replaceAll(" ", "-")}`);
    }
  };

  // If something is typed, regardless of caps and -, search ability
  const handleAbilitySearch = () => {
    if (ability.length > 0) {
      navigate(`/abilities/${ability.replaceAll(" ", "-")}`);
    }
  };

  //This will set the index of the last and first post I wish to display
  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // currentPosts will slice the data state to hold only the posts we want to see.
  // We will map over currentPosts instead of mapping over data
  const currentPosts = pokemonList.slice(indexOfFirstPost, indexOfLastPost);

  if (!pokemonList) {
    return <LoadingPage />;
  }

  return (
    <>
      <HomepageContainer>
        <Title>Competitive Pokemon Builds</Title>
        <SearchContainer>
          <AlignInputs>
            <Label>Search Pokemon:</Label>
            <SuggestionContainer>
              <Inputs
                type="text"
                placeholder="Pokemon"
                onChange={(e) => {
                  handleSuggestions(e.target.value);
                  setPokemon(e.target.value.toLowerCase());
                }}
              ></Inputs>
              <UlElement border={suggestions.length > 0}>
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => {
                    return (
                      <ListElement key={`ListSelect:${suggestion.name}`}>
                        <AutoLinkPokemon to={`/pokemon/${suggestion.name}`}>
                          {capAndRemoveHyphen(suggestion.name)}
                        </AutoLinkPokemon>
                      </ListElement>
                    );
                  })
                ) : (
                  <></>
                )}
              </UlElement>
            </SuggestionContainer>
          </AlignInputs>
          <SearchButton
            onClick={() => {
              handlePokemonSearch();
            }}
          >
            Search
          </SearchButton>
        </SearchContainer>
        <SearchContainer>
          <AlignInputs>
            <Label>Search Attack:</Label>
            <Inputs
              type="text"
              placeholder="Attack"
              onChange={(e) => setAttack(e.target.value.toLowerCase())}
            ></Inputs>
          </AlignInputs>
          <SearchButton
            onClick={() => {
              handleAttackSearch();
            }}
          >
            Search
          </SearchButton>
        </SearchContainer>
        <SearchContainer>
          <AlignInputs>
            <Label>Search Ability:</Label>
            <Inputs
              type="text"
              placeholder="Ability"
              onChange={(e) => setAbility(e.target.value.toLowerCase())}
            ></Inputs>
          </AlignInputs>
          <SearchButton onClick={() => handleAbilitySearch()}>
            Search
          </SearchButton>
        </SearchContainer>
      </HomepageContainer>
      <ButtonContainer>
        <Button
          disabled={currentPage === 0}
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
        >
          Previous
        </Button>
        <Button
          disabled={currentPosts.length < postsPerPage}
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          Next
        </Button>
      </ButtonContainer>
      <PokemonContainer>
        {currentPosts.map((pokemon, index) => {
          return (
            <IndividualPokemonContainer key={index}>
              <PokemonName to={`/pokemon/${pokemon.name}`}>
                {capAndRemoveHyphen(pokemon.name)}
              </PokemonName>
              <Sprite
                alt={"Pokemon not found"}
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                  index + 1 + postsPerPage * currentPage
                }.png`}
              />
            </IndividualPokemonContainer>
          );
        })}
      </PokemonContainer>
    </>
  );
};

export default Homepage;

// Container for the top half of the homepage container the search icons
const HomepageContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// Main title of the website
const Title = styled.h1`
  font-size: 3rem;
  margin: 2rem;
  font-weight: bold;
`;

// Individual search containers
const SearchContainer = styled.div`
  display: flex;
  width: 40%;
  margin: 0.1rem auto;
  justify-content: space-between;
  border: 0.1rem solid grey;
  border-radius: 5px;
`;

// This container ensures that the dropdown elements appear in the right place and don't extend out of the container
const SuggestionContainer = styled.div`
  display: inline-block;
  position: relative;
`;

// Styled ul element
const UlElement = styled.ul`
  list-style: none;
  position: absolute;
  border: 0.1rem solid grey;
  width: 99%;
  margin-left: 0.5%;

  border: ${(props) => (props.border ? "0.05rem solid grey" : "none")};

  /* This media query is added to keep the li elements under the input when the page is smaller */
  @media (max-width: 768px) {
    width: 50%;
    margin-left: 25%;
  }
`;

// Styling for each li element in the list
const ListElement = styled.li`
  padding: 0.5rem 0;
  background-color: white;
  margin: auto;

  &:hover {
    background-color: lightgrey;
  }
`;

const AutoLinkPokemon = styled(Link)`
  text-decoration: none;
  color: black;
`;

// This container will ensure that the labels and the inputs align
const AlignInputs = styled.div`
  margin: auto;
  width: 100%;
`;

// Styling for the labels
const Label = styled.label`
  margin: 0rem 0.5rem;
  font-weight: bold;
`;

// Styling for the inputs
const Inputs = styled.input`
  padding: 0.5rem 0;

  /* This media query is added to keep the input inside of the divs */
  @media (max-width: 768px) {
    width: 50%;
  }
`;

// Styling for the Search button
const SearchButton = styled.button`
  width: 20%;
  margin: 1rem;
  padding: 0.5rem;
  border-radius: 5px;
  overflow: hidden;
  background-image: linear-gradient(to right, #9acbed, #217ebc);

  &:hover {
    color: white;
    background-image: linear-gradient(to right, #217ebc, #033a5e);
  }

  @media (max-width: 768px) {
    width: 30%;
  }
`;

// The container that holds the pagination buttons
const ButtonContainer = styled.div`
  margin: 0.5rem;
  display: flex;
  justify-content: space-between;
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
    background-image: linear-gradient(to right, #217ebc, #033a5e);
  }
`;

// This is the container for the list of pokemon being paginated
const PokemonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 2rem 1rem;
`;

// Container for the individual pokemon
const IndividualPokemonContainer = styled.div`
  text-align: center;
  width: 10%;
  border: 0.15rem solid grey;
  margin: 0.2rem auto;
  overflow: hidden;

  /* The smaller the screen becomes, the large the icon should be to maintain a certain level of visibility, but less icons will be rendered per line */
  @media (max-width: 768px) {
    width: 20%;
  }

  @media (max-width: 480px) {
    width: 25%;
  }
`;

// Styled name of the pokemon
const PokemonName = styled(Link)`
  display: block;
  text-decoration: none;
  font-weight: bold;
  color: black;
  margin: 0.4rem auto;

  &:hover {
    color: #217ebc;
  }
`;

// Styled image of the sprite of the pokemon
const Sprite = styled.img`
  width: 50%;
  margin-bottom: 0.4rem;
  transition: transform 3s;

  &:hover {
    transform: scale(1.5);
  }
`;
