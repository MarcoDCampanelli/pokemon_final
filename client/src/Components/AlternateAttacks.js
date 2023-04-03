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

  if (!pokemon) {
    return <LoadingPage />;
  }

  return (
    <>
      <Title>Machine/Egg/Tutor Moves</Title>
      {sortable.length === 0 ? (
        <p>This Pokemon is not available this generation.</p>
      ) : (
        sortable.map((moveCombo) => {
          return (
            <Attack to={`/pokemon/${moveCombo[0]}`}>
              <Level>
                {moveCombo[1] === "machine" ? (
                  <>TM/HM</>
                ) : moveCombo[1] === "egg" ? (
                  <>Egg Move</>
                ) : (
                  <>Tutor</>
                )}
              </Level>
              <Move>{capAndRemoveHyphen(moveCombo[0])}</Move>
            </Attack>
          );
        })
      )}
    </>
  );
};

export default AlternateAttacks;

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
