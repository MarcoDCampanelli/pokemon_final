import { useState, useContext } from "react";

import styled from "styled-components";
import { UserContext } from "./UserContext";

const CreateBuildTable = ({ pokemonStats, pokemon, generation }) => {
  const { user, capAndRemoveHyphen, natures, calculateStat, calculateHealth } =
    useContext(UserContext);

  // Create an array of the Pokemon's attacks that they can learn in the selected generation regardless of method.
  const attacks = {};

  // Map over all of the attacks of the pokemon. If they match the chosen generation, then add the attack to the array
  pokemon.moves.map((move) => {
    return move.version_group_details.map((version) => {
      if (version.version_group.name === generation) {
        return (attacks[move.move.name] = version.move_learn_method.name);
      }
    });
  });

  // Create and sort an array of those moves in alphabetical order
  let sortable = [];
  for (const move in attacks) {
    sortable.push([move, attacks[move]]);
    sortable.sort((a, b) => {
      return a[0].localeCompare(b[0]);
    });
  }

  const ivSpread = {
    hp: 0,
    atk: 0,
    def: 0,
    spAtk: 0,
    spDef: 0,
    spd: 0,
  };

  const evSpread = {
    hp: 0,
    atk: 0,
    def: 0,
    spAtk: 0,
    spDef: 0,
    spd: 0,
  };

  const attackChoices = {
    atk1: "",
    atk2: "",
    atk3: "",
    atk4: "",
  };

  const [pokemonIv, setPokemonIv] = useState(ivSpread);
  const [pokemonEv, setPokemonEv] = useState(evSpread);
  const [pokemonAttacks, setPokemonAttacks] = useState(attackChoices);
  const [ability, setAbility] = useState("");
  const [nature, setNature] = useState("");
  const [level, setLevel] = useState(1);
  const [error, setError] = useState("");

  let atkNature = 1;
  if (
    nature === "lonely" ||
    nature === "brave" ||
    nature === "adamant" ||
    nature === "naughty"
  ) {
    atkNature = 1.1;
  }
  if (
    nature === "bold" ||
    nature === "timid" ||
    nature === "modest" ||
    nature === "calm"
  ) {
    atkNature = 0.9;
  }

  let defNature = 1;
  if (
    nature === "bold" ||
    nature === "relaxed" ||
    nature === "impish" ||
    nature === "lax"
  ) {
    defNature = 1.1;
  }
  if (
    nature === "lonely" ||
    nature === "hasty" ||
    nature === "mild" ||
    nature === "gentle"
  ) {
    defNature = 0.9;
  }
  let spAtkNature = 1;
  if (
    nature === "modest" ||
    nature === "mild" ||
    nature === "quiet" ||
    nature === "rash"
  ) {
    spAtkNature = 1.1;
  }
  if (
    nature === "adamant" ||
    nature === "impish" ||
    nature === "jolly" ||
    nature === "careful"
  ) {
    spAtkNature = 0.9;
  }
  let spDefNature = 1;
  if (
    nature === "calm" ||
    nature === "gentle" ||
    nature === "sassy" ||
    nature === "careful"
  ) {
    spDefNature = 1.1;
  }
  if (
    nature === "naughty" ||
    nature === "lax" ||
    nature === "naive" ||
    nature === "rash"
  ) {
    spDefNature = 0.9;
  }
  let spdNature = 1;
  if (
    nature === "timid" ||
    nature === "hasty" ||
    nature === "jolly" ||
    nature === "naive"
  ) {
    spdNature = 1.1;
  }
  if (
    nature === "brave" ||
    nature === "relaxed" ||
    nature === "quiet" ||
    nature === "sassy"
  ) {
    spdNature = 0.9;
  }

  if (!pokemon) {
    return <>Loading...</>;
  }

  console.log(pokemon);

  const handlePost = () => {
    const data = {
      // trainer: user.name,
      name: pokemon.name,
      ability: ability,
      nature: nature,
      level: level,
      iv: pokemonIv,
      ev: pokemonEv,
      // stats: [finalHp, finalAtk, finalDef, finalSpAtk, finalSpDef, finalSpd],
      attacks: pokemonAttacks,
    };

    fetch("/pokemon/competitive-build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resData) => setError(resData))
      .catch((error) => window.alert(error));
  };

  return (
    <Container>
      <Table>
        <tr>
          <TableHead>Stat Name</TableHead>
          {pokemonStats.map((stat) => {
            return <TableHead>{capAndRemoveHyphen(stat.stat.name)}</TableHead>;
          })}
        </tr>
        <tr>
          <TableHead>Stat Value</TableHead>
          {pokemonStats.map((stat) => {
            return <TableCell>{stat.base_stat}</TableCell>;
          })}
        </tr>
        <tr>
          <TableHead>IV Value</TableHead>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="31"
              value={pokemonIv.hp}
              onChange={(e) =>
                setPokemonIv({ ...pokemonIv, hp: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="31"
              value={pokemonIv.atk}
              onChange={(e) =>
                setPokemonIv({ ...pokemonIv, atk: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="31"
              value={pokemonIv.def}
              onChange={(e) =>
                setPokemonIv({ ...pokemonIv, def: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="31"
              value={pokemonIv.spAtk}
              onChange={(e) =>
                setPokemonIv({ ...pokemonIv, spAtk: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="31"
              value={pokemonIv.spDef}
              onChange={(e) =>
                setPokemonIv({ ...pokemonIv, spDef: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="31"
              value={pokemonIv.spd}
              onChange={(e) =>
                setPokemonIv({ ...pokemonIv, spd: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
        </tr>
        <tr>
          <TableHead>EV Value</TableHead>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="252"
              value={pokemonEv.hp}
              onChange={(e) =>
                setPokemonEv({ ...pokemonEv, hp: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="252"
              value={pokemonEv.atk}
              onChange={(e) =>
                setPokemonEv({ ...pokemonEv, atk: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="252"
              value={pokemonEv.def}
              onChange={(e) =>
                setPokemonEv({ ...pokemonEv, def: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="252"
              value={pokemonEv.spAtk}
              onChange={(e) =>
                setPokemonEv({ ...pokemonEv, spAtk: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="252"
              value={pokemonEv.spDef}
              onChange={(e) =>
                setPokemonEv({ ...pokemonEv, spDef: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
          <TableCell>
            <Input
              type="number"
              min="0"
              max="252"
              value={pokemonEv.spd}
              onChange={(e) =>
                setPokemonEv({ ...pokemonEv, spd: parseInt(e.target.value) })
              }
              required
            ></Input>
          </TableCell>
        </tr>
        <tr>
          <TableHead>Final Stat Value</TableHead>
          <TableCell>
            {pokemon.name !== "shedinja" ? (
              <>
                {calculateHealth(
                  pokemon.stats[0].base_stat,
                  pokemonIv.hp,
                  pokemonEv.hp,
                  level
                )}
              </>
            ) : (
              <>1</>
            )}
          </TableCell>
          <TableCell>
            {calculateStat(
              pokemon.stats[1].base_stat,
              pokemonIv.atk,
              pokemonEv.atk,
              level,
              atkNature
            )}
          </TableCell>
          <TableCell>
            {calculateStat(
              pokemon.stats[2].base_stat,
              pokemonIv.def,
              pokemonEv.def,
              level,
              defNature
            )}
          </TableCell>
          <TableCell>
            {calculateStat(
              pokemon.stats[3].base_stat,
              pokemonIv.spAtk,
              pokemonEv.spAtk,
              level,
              spAtkNature
            )}
          </TableCell>
          <TableCell>
            {calculateStat(
              pokemon.stats[4].base_stat,
              pokemonIv.spDef,
              pokemonEv.spDef,
              level,
              spDefNature
            )}
          </TableCell>
          <TableCell>
            {calculateStat(
              pokemon.stats[5].base_stat,
              pokemonIv.spd,
              pokemonEv.spd,
              level,
              spdNature
            )}
          </TableCell>
        </tr>
      </Table>
      <SelectionContainer>
        <Label>Select an Ability:</Label>
        <Select
          name="ability"
          onChange={(e) => {
            setAbility(e.target.value);
          }}
        >
          <option selected disabled>
            Select an ability
          </option>
          {pokemon.abilities.map((ability) => {
            return (
              <option value={ability.ability.name}>
                {capAndRemoveHyphen(ability.ability.name)}
              </option>
            );
          })}
        </Select>
      </SelectionContainer>
      <SelectionContainer>
        <Label>Select a Nature:</Label>
        <Select
          name="nature"
          onChange={(e) => {
            setNature(e.target.value);
          }}
        >
          <option selected disabled>
            Select a nature
          </option>
          {natures.map((nature) => {
            return <option value={nature}>{capAndRemoveHyphen(nature)}</option>;
          })}
        </Select>
      </SelectionContainer>
      <SelectionContainer>
        <Label>Level:</Label>
        <Input
          type="number"
          min="1"
          max="100"
          value={level}
          onChange={(e) => setLevel(parseInt(e.target.value))}
          required
        ></Input>
      </SelectionContainer>
      <SelectionContainer>
        <Label>Attack #1:</Label>
        <Select
          name="attack"
          onChange={(e) =>
            setPokemonAttacks({
              ...pokemonAttacks,
              atk1: e.target.value,
            })
          }
        >
          <option selected disabled>
            Select an attack:
          </option>
          {sortable.map((moveCombo) => {
            return (
              <option value={moveCombo[0]}>
                {capAndRemoveHyphen(moveCombo[0])}
              </option>
            );
          })}
        </Select>
      </SelectionContainer>
      <SelectionContainer>
        <Label>Attack #2:</Label>
        <Select
          name="attack"
          onChange={(e) =>
            setPokemonAttacks({
              ...pokemonAttacks,
              atk2: e.target.value,
            })
          }
        >
          <option selected disabled>
            Select an attack:
          </option>
          {sortable.map((moveCombo) => {
            return (
              <option value={moveCombo[0]}>
                {capAndRemoveHyphen(moveCombo[0])}
              </option>
            );
          })}
        </Select>
      </SelectionContainer>
      <SelectionContainer>
        <Label>Attack #3:</Label>
        <Select
          name="attack"
          onChange={(e) =>
            setPokemonAttacks({
              ...pokemonAttacks,
              atk3: e.target.value,
            })
          }
        >
          <option selected disabled>
            Select an attack:
          </option>
          {sortable.map((moveCombo) => {
            return (
              <option value={moveCombo[0]}>
                {capAndRemoveHyphen(moveCombo[0])}
              </option>
            );
          })}
        </Select>
      </SelectionContainer>
      <SelectionContainer>
        <Label>Attack #4:</Label>
        <Select
          name="attack"
          onChange={(e) =>
            setPokemonAttacks({
              ...pokemonAttacks,
              atk4: e.target.value,
            })
          }
        >
          <option selected disabled>
            Select an attack:
          </option>
          {sortable.map((moveCombo) => {
            return (
              <option value={moveCombo[0]}>
                {capAndRemoveHyphen(moveCombo[0])}
              </option>
            );
          })}
        </Select>
      </SelectionContainer>
      <SelectionContainer>
        {user ? (
          <Button onClick={handlePost}>Submit Pokemon</Button>
        ) : (
          <>If you wish to save your information, please sign-in.</>
        )}
      </SelectionContainer>
      {error && error.status > 299 ? (
        <ErrorContainer>
          We ran into a problem when submitting your Pokemon! Please check the
          following: {error.message}
        </ErrorContainer>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default CreateBuildTable;

// Container for the entire table as well as the ability, nature, level and attack selections
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

// Styling for the table
const Table = styled.table`
  border: 0.2rem solid black;
  text-align: center;
  margin: 1rem;
`;

// Styling for the main  categories of each row and column
const TableHead = styled.th`
  font-weight: bold;
  border: 0.1rem solid black;
  padding: 0.5rem;
  vertical-align: middle;
`;

// Styling for each individual cell in the table
const TableCell = styled.td`
  border: 0.1rem solid black;
  vertical-align: middle;
`;

// Styling for the inputs found inside of the table
const Input = styled.input`
  border: 0.1rem solid grey;
  width: 75%;
  padding: 0.2rem;
  margin: auto;
  text-align: center;
  font-size: 1rem;
`;

// Container for each of the selection options (ability, nature, level and attacks)
const SelectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0.5rem auto;
  font-weight: bold;
  align-items: center;
`;

// Styling for the labels (ability, nature, level and attacks)
const Label = styled.label`
  margin: 0rem 0.5rem;
`;

// Stlying for the select options (ability, nature, attacks)
const Select = styled.select`
  padding: 0.5rem;
  border-radius: 5px;
`;

// Styling for the button
const Button = styled.button`
  padding: 0.5rem 1rem;
  color: white;
  background-color: blue;
  border-radius: 10px;

  &:hover {
    background-color: paleturquoise;
  }
`;

// Container that holds the error messages
const ErrorContainer = styled.div`
  margin: 1rem 0;
  padding: 1rem 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

// !Proof that Pokemon was submitted + redirect to another page or Pokemon?