import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

const Profile = () => {
  const {
    currentUser,
    capAndRemoveHyphen,
    natures,
    natureValues,
    calculateHealth,
    calculateStat,
    changeNatureValues,
  } = useContext(UserContext);
  const [profile, setProfile] = useState("");
  const [pokemon, setPokemon] = useState("");
  const [update, setUpdate] = useState("");

  // These states are only being used if the user is updating the pokemon
  const [ability, setAbility] = useState("");
  const [nature, setNature] = useState("");
  const [attack, setAttack] = useState("");
  const [evSpread, setEvSpread] = useState("");
  const [ivSpread, setIvSpread] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    fetch(`/profile/${currentUser}`)
      .then((res) => res.json())
      .then((resData) => setProfile(resData.data));
  }, []);

  const handleUpdate = (name, nature, ability, attack, ev, iv, level) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((resData) => {
        setPokemon(resData);
      });

    setNature(nature);
    setAbility(ability);
    setAttack(attack);
    setEvSpread(ev);
    setIvSpread(iv);
    setLevel(level);
  };

  // These 6 variables calculate the pokemon's stat based on what is being modified
  let hp = "";
  let atk = "";
  let def = "";
  let spAtk = "";
  let spDef = "";
  let spd = "";

  if (pokemon) {
    hp = calculateHealth(
      pokemon.stats[0].base_stat,
      ivSpread.hp,
      evSpread.hp,
      level
    );

    atk = calculateStat(
      pokemon.stats[1].base_stat,
      ivSpread.atk,
      evSpread.atk,
      level,
      natureValues.atk
    );

    def = calculateStat(
      pokemon.stats[2].base_stat,
      ivSpread.def,
      evSpread.def,
      level,
      natureValues.def
    );

    spAtk = calculateStat(
      pokemon.stats[3].base_stat,
      ivSpread.spAtk,
      evSpread.spAtk,
      level,
      natureValues.spAtk
    );

    spDef = calculateStat(
      pokemon.stats[4].base_stat,
      ivSpread.spDef,
      evSpread.spDef,
      level,
      natureValues.spDef
    );

    spd = calculateStat(
      pokemon.stats[5].base_stat,
      ivSpread.spd,
      evSpread.spd,
      level,
      natureValues.spd
    );
  }

  if (!profile) {
    return <LoadingPage />;
  }

  return (
    <Container>
      {profile.party.map((member) => {
        return (
          <>
            <PokemonContainer width={member.pokemon === update}>
              <InfoContainer width={member.pokemon === update}>
                <Title>{capAndRemoveHyphen(member.pokemon)}</Title>
                <Info>Index: #{member.id}</Info>
                <Info>Level: {member.level}</Info>
                <Info>
                  Item:{" "}
                  {member.item ? (
                    <>{capAndRemoveHyphen(member.item)}</>
                  ) : (
                    <>None</>
                  )}
                </Info>
                <Info>Generation: {capAndRemoveHyphen(member.generation)}</Info>

                {member.pokemon !== update ? (
                  <Info>Nature: {capAndRemoveHyphen(member.nature)}</Info>
                ) : (
                  <>
                    <Label>Nature:</Label>
                    <Select
                      onChange={(e) => {
                        changeNatureValues(e.target.value);
                        setNature(e.target.value);
                      }}
                    >
                      <option defaultValue={true} disabled selected>
                        Select a nature
                      </option>
                      {natures &&
                        natures.map((nature) => {
                          {
                            return (
                              <option
                                value={nature}
                                selected={nature === member.nature}
                              >
                                {capAndRemoveHyphen(nature)}
                              </option>
                            );
                          }
                        })}
                    </Select>
                  </>
                )}

                {member.pokemon !== update ? (
                  <Info>Ability: {capAndRemoveHyphen(member.ability)}</Info>
                ) : (
                  <>
                    <Label>Ability:</Label>
                    <Select onChange={(e) => setAbility(e.target.value)}>
                      <option defaultValue={true} disabled>
                        Select an ability
                      </option>
                      {pokemon &&
                        pokemon.abilities.map((ability) => {
                          {
                            return (
                              <option
                                value={ability.ability.name}
                                selected={
                                  ability.ability.name === member.ability
                                }
                              >
                                {capAndRemoveHyphen(ability.ability.name)}
                              </option>
                            );
                          }
                        })}
                    </Select>
                  </>
                )}
                <div>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.id}.png`}
                  />
                </div>
              </InfoContainer>
              <AttackContainer width={member.pokemon === update}>
                <Title>Attacks</Title>
                {member.pokemon !== update ? (
                  <>
                    {Object.values(member.attacks).map((attack) => {
                      return (
                        <AttackLink to={`/attacks/${attack}`}>
                          {capAndRemoveHyphen(attack)}
                        </AttackLink>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <IndividualAttack>
                      <Label>Attack #1:</Label>
                      <Select
                        name="attack"
                        onChange={(e) =>
                          setAttack({ ...attack, atk1: e.target.value })
                        }
                      >
                        <option defaultValue={true} disabled selected>
                          Select an attack:
                        </option>
                        {pokemon &&
                          pokemon.moves.map((move) => {
                            return move.version_group_details.map((version) => {
                              if (
                                version.version_group.name === member.generation
                              ) {
                                return (
                                  <option
                                    value={move.move.name}
                                    selected={
                                      move.move.name === member.attacks.atk1
                                    }
                                  >
                                    {capAndRemoveHyphen(move.move.name)}
                                  </option>
                                );
                              } else {
                                <></>;
                              }
                            });
                          })}
                      </Select>
                    </IndividualAttack>
                    <IndividualAttack>
                      <Label>Attack #2:</Label>
                      <Select
                        name="attack"
                        onChange={(e) =>
                          setAttack({ ...attack, atk2: e.target.value })
                        }
                      >
                        <option defaultValue={true} disabled selected>
                          Select an attack:
                        </option>
                        {pokemon &&
                          pokemon.moves.map((move) => {
                            return move.version_group_details.map((version) => {
                              if (
                                version.version_group.name === member.generation
                              ) {
                                return (
                                  <option
                                    value={move.move.name}
                                    selected={
                                      move.move.name === member.attacks.atk2
                                    }
                                  >
                                    {capAndRemoveHyphen(move.move.name)}
                                  </option>
                                );
                              }
                            });
                          })}
                      </Select>
                    </IndividualAttack>
                    <IndividualAttack>
                      <Label>Attack #3:</Label>
                      <Select
                        name="attack"
                        onChange={(e) =>
                          setAttack({ ...attack, atk3: e.target.value })
                        }
                      >
                        <option defaultValue={true} disabled selected>
                          Select an attack:
                        </option>
                        {pokemon &&
                          pokemon.moves.map((move) => {
                            return move.version_group_details.map((version) => {
                              if (
                                version.version_group.name === member.generation
                              ) {
                                return (
                                  <option
                                    value={move.move.name}
                                    selected={
                                      move.move.name === member.attacks.atk3
                                    }
                                  >
                                    {capAndRemoveHyphen(move.move.name)}
                                  </option>
                                );
                              }
                            });
                          })}
                      </Select>
                    </IndividualAttack>
                    <IndividualAttack>
                      <Label>Attack #4:</Label>
                      <Select
                        name="attack"
                        onChange={(e) =>
                          setAttack({ ...attack, atk4: e.target.value })
                        }
                      >
                        <option defaultValue={true} disabled selected>
                          Select an attack:
                        </option>
                        {pokemon &&
                          pokemon.moves.map((move) => {
                            return move.version_group_details.map((version) => {
                              if (
                                version.version_group.name === member.generation
                              ) {
                                return (
                                  <option
                                    value={move.move.name}
                                    selected={
                                      move.move.name === member.attacks.atk4
                                    }
                                  >
                                    {capAndRemoveHyphen(move.move.name)}
                                  </option>
                                );
                              }
                            });
                          })}
                      </Select>
                    </IndividualAttack>
                  </>
                )}
              </AttackContainer>
              <StatContainer width={member.pokemon === update}>
                <Title>Stat Totals</Title>
                {member.pokemon !== update ? (
                  <>
                    {Object.keys(member.iv).map((stat, index) => {
                      return (
                        <div>
                          {capAndRemoveHyphen(stat)} : {member.stats[index]}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <Table>
                    <tr>
                      <TableHead>Stat Name:</TableHead>
                      {Object.keys(member.iv).map((stat, index) => {
                        return (
                          <TableHead>{capAndRemoveHyphen(stat)}</TableHead>
                        );
                      })}
                    </tr>
                    <tr>
                      <TableHead>Base Stat</TableHead>
                      {pokemon &&
                        pokemon.stats.map((stat) => {
                          return <TableCell>{stat.base_stat}</TableCell>;
                        })}
                    </tr>
                    <tr>
                      <TableHead>IV</TableHead>
                      {pokemon &&
                        Object.values(ivSpread).map((iv, index) => {
                          let keys = Object.keys(ivSpread);
                          return (
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="31"
                                defaultValue={iv}
                                onChange={(e) => {
                                  setIvSpread({
                                    ...ivSpread,
                                    [keys[index]]: parseInt(e.target.value),
                                  });
                                }}
                              ></Input>
                            </TableCell>
                          );
                        })}
                    </tr>
                    <tr>
                      <TableHead>EV</TableHead>
                      {pokemon &&
                        Object.values(evSpread).map((ev, index) => {
                          let keys = Object.keys(evSpread);
                          return (
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="31"
                                defaultValue={ev}
                                onChange={(e) => {
                                  setEvSpread({
                                    ...evSpread,
                                    [keys[index]]: parseInt(e.target.value),
                                  });
                                }}
                              ></Input>
                            </TableCell>
                          );
                        })}
                    </tr>
                    <tr>
                      <TableHead>Final Stat Value</TableHead>
                      {pokemon ? (
                        <>
                          {pokemon.name === "shedinja" ? (
                            <TableCell>1</TableCell>
                          ) : (
                            <TableCell>{hp}</TableCell>
                          )}
                          <TableCell>{atk}</TableCell>
                          <TableCell>{def}</TableCell>
                          <TableCell>{spAtk}</TableCell>
                          <TableCell>{spDef}</TableCell>
                          <TableCell>{spd}</TableCell>
                        </>
                      ) : (
                        <></>
                      )}
                    </tr>
                  </Table>
                )}
              </StatContainer>
            </PokemonContainer>
            <button
              onClick={() => {
                setUpdate(member.pokemon);
                handleUpdate(
                  member.pokemon,
                  member.nature,
                  member.ability,
                  member.attacks,
                  member.ev,
                  member.iv,
                  member.level
                );
              }}
            >
              Click Me
            </button>
          </>
        );
      })}
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const PokemonContainer = styled.div`
  display: flex;
  margin: 1rem auto;
  border: 2px solid black;

  width: ${(props) => (props.width ? "95%" : "40%")};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  text-align: center;

  width: ${(props) => (props.width ? "20%" : "40%")};

  @media (max-width: 912px) {
    margin: auto;
    width: 80%;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  margin: 0.5rem;
`;

const Info = styled.div`
  margin: 0.2rem;
`;

const AttackContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 30%;
  border-left: 0.2rem solid black;
  border-right: 0.2rem solid black;

  @media (max-width: 912px) {
    margin: 0 auto;
    border: none;
    width: 80%;
  }
`;

const AttackLink = styled(Link)`
  text-decoration: underline;
  color: black;
  margin: 0.2rem;

  &:hover {
    background-color: lightblue;
  }
`;

const IndividualAttack = styled.div`
  margin: 1rem;
`;

const StatContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  width: ${(props) => (props.width ? "50%" : "30%")};

  @media (max-width: 912px) {
    margin: 0 auto;
    width: 80%;
  }
`;

// Styling for the labels (ability, nature, level and attacks)
const Label = styled.label`
  margin: 0rem 0.5rem;
`;

// Stlying for the select options (ability, nature, attacks)
const Select = styled.select`
  padding: 0.5rem;
  border-radius: 5px;
  width: 50%;
  margin: auto;
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