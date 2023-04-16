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
  // !!!!!!Testing to finish the autocomplete search
  const [suggestions, setSuggestions] = useState("");

  const filterSuggestions = (typed) => {
    const pokemonMatches = pokemonList.filter((monster) => {
      if (monster.name.includes(typed.toLowerCase())) {
        return true;
      }
    });
    setSuggestions(pokemonMatches);
  };

  const handleSuggestions = (typed) => {
    if (pokemon.length > 2) {
      return filterSuggestions(typed);
    }
    setSuggestions([]);
  };

  // !End of tests

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
          <Label>Search Pokemon:</Label>
          <Inputs
            type="text"
            placeholder="Pokemon"
            onChange={(e) => {
              handleSuggestions(e.target.value);
              setPokemon(e.target.value.toLowerCase());
            }}
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
            onChange={(e) => setAttack(e.target.value.toLowerCase())}
          ></Inputs>
          <SearchButton
            onClick={() => {
              handleAttackSearch();
            }}
          >
            Search
          </SearchButton>
        </SearchContainer>
        <SearchContainer>
          <Label>Search Ability:</Label>
          <Inputs
            type="text"
            placeholder="Ability"
            onChange={(e) => setAbility(e.target.value.toLowerCase())}
          ></Inputs>
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

// const TestUl = styled.ul`
//   list-style: none;
//   position: absolute;
//   width: 90%;
//   margin-left: 5%;
// `;

// const TestLi = styled.li``;

// const TestDiv = styled.div`
//   display: inline-block;
//   position: relative;
//   background-color: yellow;

//   @media (max-width: 768px) {
//     width: 25%;
//   }
// `;

// const TestInput = styled.input`
//   width: 80%;
//   padding: 0.5rem 0;
// `;

// Container for the top half of the homepage container the search icons
const HomepageContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// Main title of the website
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

  /* On smaller screens center the text to allow for more room */
  @media (max-width: 768px) {
    width: 80%;
    text-align: center;
  }
`;

// Styling for the labels
const Label = styled.label`
  margin: 0rem 0.5rem;
  font-weight: bold;
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

// !Testing
const StyledListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  /* margin-right: 1rem; */
`;

const ListElement = styled.li`
  list-style: none;
  padding: 0.5rem;
  border: 0.1rem solid black;
  width: 30%;
  margin-left: 63%;
  background-color: yellow;
  text-align: center;

  @media (max-width: 768px) {
    width: 25%;
  }
`;

// !Testing

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
    background-color: lightblue;
  }
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

  &:hover {
    color: lightblue;
  }
`;

// Styled image of the sprite of the pokemon
const Sprite = styled.img`
  width: 50%;
`;
