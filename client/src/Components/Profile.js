import { useState, useEffect, useContext } from "react";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

const Profile = () => {
  const { currentUser, capAndRemoveHyphen, natures } = useContext(UserContext);
  const [profile, setProfile] = useState("");
  const [pokemon, setPokemon] = useState("");
  const [update, setUpdate] = useState("");

  // These states are only being used if the user is updating the pokemon
  const [ability, setAbility] = useState("");
  const [nature, setNature] = useState("");
  const [attack, setAttack] = useState("");
  const [evSpread, SetEvSpread] = useState("");
  const [ivSpread, setIvSpread] = useState("");

  useEffect(() => {
    fetch(`/profile/${currentUser}`)
      .then((res) => res.json())
      .then((resData) => setProfile(resData.data));
  }, []);

  const handleUpdate = (name, nature, ability, attack, ev, iv) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((resData) => {
        setPokemon(resData);
      });

    setNature(nature);
    setAbility(ability);
    setAttack(attack);
    SetEvSpread(ev);
    setIvSpread(iv);
  };

  if (!profile) {
    return <LoadingPage />;
  }

  console.log(ivSpread);

  return (
    <Container>
      {profile.party.map((member) => {
        return (
          <>
            <PokemonContainer>
              <InfoContainer>
                <h1>{capAndRemoveHyphen(member.pokemon)}</h1>
                <div>Level: {member.level}</div>
                <div>Index: {member.id}</div>
                <div>Item: {member.item ? <>{member.item}</> : <>None</>}</div>
                <div>Generation: {capAndRemoveHyphen(member.generation)}</div>
                <div>
                  <Label>Nature:</Label>
                  {member.pokemon !== update ? (
                    <Select disabled={member.pokemon !== update}>
                      <option>{capAndRemoveHyphen(member.nature)}</option>
                    </Select>
                  ) : (
                    <Select onChange={(e) => setNature(e.target.value)}>
                      <option disabled selected>
                        Select a nature
                      </option>
                      {natures &&
                        natures.map((nature) => {
                          return (
                            <option value={nature}>
                              {capAndRemoveHyphen(nature)}
                            </option>
                          );
                        })}
                    </Select>
                  )}
                </div>
                <div>
                  <Label>Ability:</Label>
                  {member.pokemon !== update ? (
                    <Select disabled={member.pokemon !== update}>
                      <option>{capAndRemoveHyphen(member.ability)}</option>
                    </Select>
                  ) : (
                    <Select onChange={(e) => setAbility(e.target.value)}>
                      <option disabled selected>
                        Select an ability
                      </option>
                      {pokemon &&
                        pokemon.abilities.map((ability) => {
                          return (
                            <option value={ability.ability.name}>
                              {capAndRemoveHyphen(ability.ability.name)}
                            </option>
                          );
                        })}
                    </Select>
                  )}
                </div>
                <div>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.id}.png`}
                  />
                </div>
              </InfoContainer>
              <div>
                {member.pokemon !== update ? (
                  <>
                    <div>Attacks</div>
                    {Object.values(member.attacks).map((attack) => {
                      return <div>{capAndRemoveHyphen(attack)}</div>;
                    })}
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Attack #1:</Label>
                      <Select
                        name="attack"
                        onChange={(e) =>
                          setAttack({ ...attack, atk1: e.target.value })
                        }
                      >
                        <option selected disabled>
                          Select an attack:
                        </option>
                        {pokemon &&
                          pokemon.moves.map((move) => {
                            return move.version_group_details.map((version) => {
                              if (
                                version.version_group.name === member.generation
                              ) {
                                return <option>{move.move.name}</option>;
                              }
                            });
                          })}
                      </Select>
                    </div>
                    <div>
                      <Label>Attack #2:</Label>
                      <Select
                        name="attack"
                        onChange={(e) =>
                          setAttack({ ...attack, atk2: e.target.value })
                        }
                      >
                        <option selected disabled>
                          Select an attack:
                        </option>
                        {pokemon &&
                          pokemon.moves.map((move) => {
                            return move.version_group_details.map((version) => {
                              if (
                                version.version_group.name === member.generation
                              ) {
                                return <option>{move.move.name}</option>;
                              }
                            });
                          })}
                      </Select>
                    </div>
                    <div>
                      <Label>Attack #3:</Label>
                      <Select
                        name="attack"
                        onChange={(e) =>
                          setAttack({ ...attack, atk3: e.target.value })
                        }
                      >
                        <option selected disabled>
                          Select an attack:
                        </option>
                        {pokemon &&
                          pokemon.moves.map((move) => {
                            return move.version_group_details.map((version) => {
                              if (
                                version.version_group.name === member.generation
                              ) {
                                return <option>{move.move.name}</option>;
                              }
                            });
                          })}
                      </Select>
                    </div>
                    <div>
                      <Label>Attack #4:</Label>
                      <Select
                        name="attack"
                        onChange={(e) =>
                          setAttack({ ...attack, atk4: e.target.value })
                        }
                      >
                        <option selected disabled>
                          Select an attack:
                        </option>
                        {pokemon &&
                          pokemon.moves.map((move) => {
                            return move.version_group_details.map((version) => {
                              if (
                                version.version_group.name === member.generation
                              ) {
                                return <option>{move.move.name}</option>;
                              }
                            });
                          })}
                      </Select>
                    </div>
                  </>
                )}
              </div>
              <div>
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
                  <table>
                    <tr>
                      <th>Stat Name:</th>
                      {Object.keys(member.iv).map((stat, index) => {
                        return <th>{capAndRemoveHyphen(stat)}</th>;
                      })}
                    </tr>
                    <tr>
                      <th>Base Stat</th>
                      {pokemon &&
                        pokemon.stats.map((stat) => {
                          return <td>{stat.base_stat}</td>;
                        })}
                    </tr>
                    <tr>
                      <th>IV</th>
                      {pokemon &&
                        Object.values(ivSpread).map((iv, index) => {
                          let keys = Object.keys(ivSpread);
                          return (
                            <td>
                              <input
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
                              ></input>
                            </td>
                          );
                        })}
                    </tr>
                  </table>
                )}
              </div>
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
                  member.iv
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
  width: 80%;
  margin: 1rem auto;
  border: 2px solid black;
  background-color: red;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  text-align: center;
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
