import { useContext } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

// This component will render a list of attacks that the pokemon can learn by level-up
const Attacks = ({ pokemon, generation }) => {
  const { capAndRemoveHyphen } = useContext(UserContext);
  // Create an array of the Pokemon's attacks and levels at which those attacks are learned
  const attacks = {};

  // Map over the attacks of a pokemon. If the attack can be learned in the selected generation by level up, push it into the attacks object and include it's level
  pokemon.moves.map((move) => {
    return move.version_group_details.map((version) => {
      if (
        version.version_group.name === generation &&
        version.move_learn_method.name === "level-up"
      ) {
        return (attacks[move.move.name] = version.level_learned_at);
      }
    });
  });

  // Create and sort an array of those moves in chronological order by level up
  let sortable = [];
  for (const move in attacks) {
    // First push all of the attacks into the array
    sortable.push([move, attacks[move]]);
    // Then, sort those attacks in order by level up
    sortable.sort((a, b) => {
      return a[1] - b[1];
    });
  }

  if (!pokemon) {
    return <LoadingPage />;
  }

  return (
    <>
      <Title>Learn-up Move Set</Title>
      {sortable.length === 0 ? (
        <p>This Pokemon is not available this generation.</p>
      ) : (
        sortable.map((moveCombo) => {
          return (
            <Container key={`AttackList:${moveCombo[0]}`}>
              <Level>
                {moveCombo[1] !== 0 ? <>Lvl:{moveCombo[1]}</> : <>Evo</>}
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

export default Attacks;

// Styling for the title of the list
const Title = styled.p`
  font-weight: bold;
`;

// Container that holds the list of attacks and level at which they are learned
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin: 0.2rem 0;
  border: 0.1rem solid black;
  border-radius: 5px;
`;

// Styling for the div that holds the level learned
const Level = styled.div`
  text-align: left;
  margin-left: 0.1rem;
  overflow: hidden;
  min-width: 30%;
  font-weight: bold;
`;

// Styling for the link to each attack
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
