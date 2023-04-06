import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";

const IndividualAttack = () => {
  const id = useParams();
  const { capAndRemoveHyphen, nameExceptions } = useContext(UserContext);
  const [attack, setAttack] = useState("");

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/move/${id.attack}/`).then((res) => {
      res.json().then((resData) => {
        setAttack(resData);
      });
    });
  }, [id]);

  if (!attack) {
    return <>Loading...</>;
  }

  console.log(attack);

  return (
    <Container>
      <MoveName>{capAndRemoveHyphen(attack.name)}</MoveName>
      <MoveInformation>
        <TableTitles>
          <MoveStat>Type:</MoveStat>
          {capAndRemoveHyphen(attack.type.name)}
        </TableTitles>
        <MoveStatsContainer>
          <MoveStatContainer>
            <MoveStat>Accuracy:</MoveStat>
            {attack.accuracy}%
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
              <span>
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
                  <ListElement to={`/pokemon/${pokemon.name.split("-")[0]}`}>
                    {capAndRemoveHyphen(pokemon.name)}
                  </ListElement>
                );
              } else {
                return (
                  <ListElement to={`/pokemon/${pokemon.name}`}>
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
                  <PokedexEntryContainer>
                    <PokedexGeneration>
                      {capAndRemoveHyphen(entry.version_group.name)}
                    </PokedexGeneration>
                    <PokedexEntry>{entry.flavor_text}</PokedexEntry>
                  </PokedexEntryContainer>
                );
              }
            })}
          </ListParent>
        </IndividualListContainerDescriptions>
      </ListContainer>
    </Container>
  );
};

export default IndividualAttack;

// Overall Container
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

// Contains all of the infomation about the move
const MoveInformation = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  border: 0.1rem solid black;

  @media (max-width: 768px) {
    width: 75%;
  }
`;

// Styling for the horizontal titles in the table
const TableTitles = styled.div`
  text-align: center;
  width: 100%;
  border-bottom: 1px solid black;
  padding: 0.5rem 0;
  font-weight: bold;
`;

// Styling for the main info of the attack (accuracy, power, pp, priority, damage)
const MoveStatsContainer = styled.div`
  display: flex;
  text-align: center;
  width: 100%;
  overflow: hidden;
  border-bottom: 0.1rem solid black;
`;

// Styling for the minor titles in the table (accuracy, power, pp, priority, damage)
const MoveStat = styled.div`
  font-weight: bold;
  text-align: center;
`;

// Individual boxes
const MoveStatContainer = styled.div`
  border-right: 0.1rem solid black;
  overflow: hidden;
  padding: 0.5rem;
  width: 20%;
`;

// Last box in the column relating to the box above
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
  margin: 1rem;
`;

// Container for list of pokemon
const IndividualListContainer = styled.div`
  border: 0.2rem solid black;
  max-height: 900px;
  overflow: auto;
  margin: 3rem 1rem;
`;

// Container for list of entries
const IndividualListContainerDescriptions = styled.div`
  position: relative;
  top: 0;
  margin: 3rem 1rem;
  overflow: auto;
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
  border: 0.1rem solid black;
  border-radius: 5px;
  margin: 0.25rem;
  padding: 0.5rem;

  &:hover {
    background-color: lightblue;
  }
`;

// Styling for the li elements in the list of entries
const PokedexEntryContainer = styled.li`
  width: 98%;
  display: flex;
  margin: 0.5rem auto;
  padding: 0.5rem 0;
  border: 0.1rem solid black;
  border-radius: 5px;
`;

const PokedexGeneration = styled.div`
  max-width: 20%;
  min-width: 20%;
  border-right: 1px solid black;
  overflow: hidden;
`;

const PokedexEntry = styled.div`
  padding-left: 0.5rem;
`;
