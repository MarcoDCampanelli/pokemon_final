import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

// This component will create a page for a specific attack
const IndividualAttack = () => {
  const id = useParams();
  const { capAndRemoveHyphen, nameExceptions, returnIcon } =
    useContext(UserContext);
  const [attack, setAttack] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/move/${id.attack}/`).then((res) => {
      res
        .json()
        .then((resData) => {
          setAttack(resData);
        })
        .catch((err) => navigate("/error"));
    });
  }, [id]);

  if (!attack) {
    return <LoadingPage />;
  }

  return (
    <Container>
      <MoveName>{capAndRemoveHyphen(attack.name)}</MoveName>
      <MoveInformation>
        <TableTitles>
          <MoveStat>Type:</MoveStat>
          {capAndRemoveHyphen(attack.type.name)}
          <Icon>{returnIcon(attack.type.name)}</Icon>
        </TableTitles>
        <MoveStatsContainer>
          <MoveStatContainer>
            <MoveStat>Accuracy:</MoveStat>
            {attack.accuracy ? <>{attack.accuracy}%</> : <>-</>}
          </MoveStatContainer>
          <MoveStatContainer>
            <MoveStat>Power:</MoveStat>
            {attack.power === null ? <>-</> : attack.power}
          </MoveStatContainer>
          <MoveStatContainer>
            <MoveStat>Power Points:</MoveStat>
            {attack.pp}
          </MoveStatContainer>
          <MoveStatContainer>
            <MoveStat>Priority:</MoveStat>
            {attack.priority}
          </MoveStatContainer>
          <MoveStatContainerLast>
            <MoveStat>Damage Type:</MoveStat>
            {capAndRemoveHyphen(attack.damage_class.name)}
          </MoveStatContainerLast>
        </MoveStatsContainer>
        <TableTitles>Ability Description</TableTitles>
        <AbilityDescriptionContainer>
          {attack.effect_entries.map((entry) => {
            return (
              <span key={entry.effect}>
                {entry.effect.replace(
                  "$effect_chance% ",
                  `${attack.effect_chance}% `
                )}
              </span>
            );
          })}
        </AbilityDescriptionContainer>
      </MoveInformation>
      <ListContainer>
        <IndividualListContainer>
          <ListTitle>
            Pokemon who learn {capAndRemoveHyphen(attack.name)}
          </ListTitle>
          <ListParent>
            {attack.learned_by_pokemon.map((pokemon) => {
              let array = pokemon.name.split("-");
              let exceptions = nameExceptions.some((item) =>
                array.includes(item)
              );
              if (exceptions) {
                return (
                  <ListElement
                    to={`/pokemon/${pokemon.name.split("-")[0]}`}
                    key={pokemon.name}
                  >
                    {capAndRemoveHyphen(pokemon.name)}
                  </ListElement>
                );
              } else {
                return (
                  <ListElement
                    to={`/pokemon/${pokemon.name}`}
                    key={pokemon.name}
                  >
                    {capAndRemoveHyphen(pokemon.name)}
                  </ListElement>
                );
              }
            })}
          </ListParent>
        </IndividualListContainer>
        <IndividualListContainerDescriptions>
          <ListTitle>Move description by Pokedex entry:</ListTitle>
          <ListParent>
            {attack.flavor_text_entries.map((entry) => {
              if (entry.language.name === "en") {
                return (
                  <PokedexEntryContainer key={entry.version_group.name}>
                    <PokedexGeneration>
                      {capAndRemoveHyphen(entry.version_group.name)}
                    </PokedexGeneration>
                    <PokedexEntry>{entry.flavor_text}</PokedexEntry>
                  </PokedexEntryContainer>
                );
              } else {
                return <></>;
              }
            })}
          </ListParent>
        </IndividualListContainerDescriptions>
      </ListContainer>
    </Container>
  );
};

export default IndividualAttack;

// Overall Container for the whole page
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

// Styling for the name of the attack
const MoveName = styled.h1`
  font-size: 3rem;
  margin: 1rem 0;
  text-align: center;
`;

// Contains all of the infomation about the move at the top of the page
const MoveInformation = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  border: 0.1rem solid grey;

  /* On smaller screens, the width is increased */
  @media (max-width: 768px) {
    width: 75%;
  }
`;

// Styling for the horizontal titles in the table (separate for border reasons)
const TableTitles = styled.div`
  text-align: center;
  width: 100%;
  border-bottom: 1px solid grey;
  padding: 0.5rem 0;
  font-weight: bold;
  font-size: 1.1rem;
`;

// Styling for the icon
const Icon = styled.div`
  font-size: 1.5rem;
  margin: 0.5rem 0;
`;

// Container for the main info of the attack (accuracy, power, pp, priority, damage)
const MoveStatsContainer = styled.div`
  display: flex;
  text-align: center;
  width: 100%;
  overflow: hidden;
  border-bottom: 0.1rem solid grey;
`;

// Styling for the minor titles in the table (accuracy, power, pp, priority, damage)
const MoveStat = styled.div`
  font-weight: bold;
  text-align: center;
  font-size: 1.1rem;
`;

// Individual boxes inside of the MoveStatsContainer
const MoveStatContainer = styled.div`
  border-right: 0.1rem solid grey;
  overflow: hidden;
  padding: 0.5rem;
  width: 20%;
`;

// Last box in the column relating to the box above (no border required for this one)
const MoveStatContainerLast = styled.div`
  width: 20%;
  padding: 0.5rem;
`;

// Container that holds the description of the attack
const AbilityDescriptionContainer = styled.div`
  text-align: center;
  margin: 1rem;
`;

// Container for the list of pokemons and pokedex entries by generation
const ListContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
  background-color: #dbdbdb;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Container for list of pokemon
const IndividualListContainer = styled.div`
  max-height: 900px;
  overflow: auto;
  margin: 3rem 1rem;
  width: 25%;

  /* On smaller screens, the width is increased */
  @media (max-width: 980px) {
    width: 50%;
  }

  /* On smaller screens when flex-directio is column, set width to auto in order to center it */
  @media (max-width: 768px) {
    margin: auto;
  }
`;

// Titles for the list of pokemon / entries
const ListTitle = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 1rem;
`;

// Styling for the whole list
const ListParent = styled.ul`
  list-style: none;
  text-align: center;
`;

// Styling for the li elements in the list of pokemon
const ListElement = styled(Link)`
  display: flex;
  text-decoration: none;
  justify-content: center;
  color: black;
  border: 0.1rem solid grey;
  border-radius: 5px;
  margin: 0.25rem;
  padding: 0.5rem;
  background-color: white;

  &:hover {
    color: white;
    background-image: linear-gradient(to right, #217ebc, #033a5e);
  }
`;

// Container for list of entries
const IndividualListContainerDescriptions = styled.div`
  position: relative;
  top: 0;
  margin: 3rem 1rem;
  overflow: auto;
`;

// Styling for the li elements in the list of entries
const PokedexEntryContainer = styled.li`
  display: flex;
  margin: 0.5rem auto;
  border: 0.1rem solid grey;
  border-radius: 5px;
  background-color: white;
`;

// Styling for the div that holds the generation name
const PokedexGeneration = styled.div`
  max-width: 20%;
  min-width: 20%;
  padding: 0.5rem 0;
  border-right: 0.1rem solid grey;
  overflow: hidden;
`;

// Styling for the description of the attack
const PokedexEntry = styled.div`
  padding: 0.5rem 0 0.5rem 0.5rem;
`;
