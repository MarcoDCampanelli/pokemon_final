import { useContext } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

const Attacks = ({ pokemon, generation }) => {
  const { capAndRemoveHyphen } = useContext(UserContext);
  // Create an array of the Pokemon's attacks and levels at which those attacks are learned
  const attacks = {};

  // Map over the attacks of a pokemon. If the attack can be learned in the selected generation by level up, push it onto the attacks object
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
            <Attack to={`/pokemon/${moveCombo[0]}`}>
              <Level>
                {moveCombo[1] !== 0 ? <>Lvl:{moveCombo[1]}</> : <>Evo</>}
              </Level>
              <Move>{capAndRemoveHyphen(moveCombo[0])}</Move>
            </Attack>
          );
        })
      )}
    </>
  );
};

export default Attacks;

const Attack = styled(Link)`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  border: 0.1rem solid black;
  border-radius: 5px;
  margin: 0.25rem;
  padding: 0.25rem 0;
  text-decoration: none;
  color: black;

  &:hover {
    background-color: blue;
  }
`;

const Title = styled.p`
  font-weight: bold;
`;

const Level = styled.div`
  overflow: hidden;
  text-align: left;
  min-width: 30%;
  font-weight: bold;
  margin: 0.4rem;
  border-right: 1px solid black;
`;

const Move = styled.div`
  text-align: left;
  margin: 0.4rem;
  width: 100%;
`;
