import { useContext } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

const AlternateAttacks = ({ pokemon, generation }) => {
  const { capAndRemoveHyphen } = useContext(UserContext);

  // Create an array of the Pokemon's attacks and the method in which those attacks are learned
  const attacks = {};

  // Map over the attacks of a pokemon. If te attack can be learned in the selected generation (and isn't a level-up attack), push it into the attacks object and include the method that it is learned in.
  pokemon.moves.map((move) => {
    return move.version_group_details.map((version) => {
      if (
        version.version_group.name === generation &&
        version.move_learn_method.name !== "level-up"
      ) {
        return (attacks[move.move.name] = version.move_learn_method.name);
      }
    });
  });

  // Create and sort an array of those moves in alphabetical order by method (machines will be grouped together, egg moves and move tutors)
  let sortable = [];
  for (const move in attacks) {
    sortable.push([move, attacks[move]]);
    sortable.sort((a, b) => {
      return a[1].localeCompare(b[1]);
    });
  }

  // This array is used to see whether the pokemon learns any moves this generation. If yes, but the previous sortable array is empty, then the pokemon is part of the generation, but can't learn any tm/hm/egg/tutor moves
  let array = [];

  pokemon.moves.map((move) =>
    move.version_group_details.map((version) =>
      array.push(version.version_group.name)
    )
  );

  if (!pokemon) {
    return <LoadingPage />;
  }

  return (
    <>
      <Title>Machine/Egg/Tutor Moves</Title>
      {array.includes(generation) ? (
        <>
          This pokemon can't learn any moves by TM/HM, breeding or move tutors
        </>
      ) : sortable.length === 0 ? (
        <p>This Pokemon is not available this generation.</p>
      ) : (
        sortable.map((moveCombo) => {
          return (
            <Container>
              <Level>
                {moveCombo[1] === "machine" ? (
                  <>TM/HM</>
                ) : moveCombo[1] === "egg" ? (
                  <>Egg Move</>
                ) : (
                  <>Tutor</>
                )}
              </Level>
              <Move to={`/attacks/${moveCombo[0]}`}>
                {capAndRemoveHyphen(moveCombo[0])}
              </Move>
            </Container>
          );
        })
      )}
    </>
  );
};

export default AlternateAttacks;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin: 0.2rem 0;
  border: 0.1rem solid black;
  border-radius: 5px;
`;

const Title = styled.p`
  font-weight: bold;
`;

const Level = styled.div`
  text-align: left;
  margin-left: 0.1rem;
  overflow: hidden;
  min-width: 30%;
  font-weight: bold;
`;

const Move = styled(Link)`
  text-decoration: none;
  color: black;
  overflow: hidden;
  text-align: center;
  width: 60%;
  border-left: 0.1rem solid black;

  &:hover {
    background-color: lightblue;
  }
`;
