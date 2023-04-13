import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

// This component creates the profile of the signed in user
const Profile = () => {
  const {
    currentUser,
    capAndRemoveHyphen,
    nameExceptions,
    natures,
    natureValues,
    calculateHealth,
    calculateStat,
    changeNatureValues,
  } = useContext(UserContext);
  const navigate = useNavigate();

  // This state holds the profile of the signed in user
  const [profile, setProfile] = useState("");
  // This state holds the information of the Pokemon being updated in order to shuffle through their abilities/attacks
  const [pokemon, setPokemon] = useState("");
  // This update is set to the Pokemon's unique _id in order to only allow one build to be changed at a time
  const [update, setUpdate] = useState("");
  // This state is only being used if an error occurs or if an update takes place.
  const [error, setError] = useState("");

  // These states are only being used if the user is updating the pokemon
  const [ability, setAbility] = useState("");
  const [nature, setNature] = useState("");
  const [attack, setAttack] = useState("");
  const [evSpread, setEvSpread] = useState("");
  const [ivSpread, setIvSpread] = useState("");
  const [level, setLevel] = useState("");
  // This state is only being used to organize the attacks in alphabetical order
  const [generation, setGeneration] = useState("");

  // These states are being used in order to describe/post the build
  const [value, setValue] = useState(1000);
  const [entry, setEntry] = useState("");

  // This will grab the profile of the currentUser and update whenever a new error message is rendered due to an update
  useEffect(() => {
    fetch(`/profile/${currentUser}`)
      .then((res) => res.json())
      .then((resData) => setProfile(resData.data))
      .catch((err) => navigate("/error"));
  }, [error]);

  // This will grab the info of the pokemon selected to be updated and set all of the states to those of the selected Pokemon
  const handleUpdate = (
    name,
    nature,
    ability,
    attack,
    ev,
    iv,
    level,
    generation
  ) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((resData) => {
        setPokemon(resData);
      })
      .catch((err) => navigate("/error"));

    setAbility(ability);
    setNature(nature);
    setAttack(attack);
    setEvSpread(ev);
    setIvSpread(iv);
    setLevel(level);
    setError("");
    setGeneration(generation);
  };

  // These 6 variables and functions calculate the pokemon's stat based on what is being modified
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

  // This will allow the natures to be rendered in alphabetical order
  let natureArray = [];
  if (natures) {
    natures.map((nature) => {
      natureArray.push(nature);
    });
    natureArray.sort((a, b) => {
      return a.localeCompare(b);
    });
  }

  // This will allow the attacks to be rendered in alphabetical order and remove any duplicates
  let attackArray = [];
  if (pokemon && generation) {
    pokemon.moves.map((move) => {
      return move.version_group_details.map((version) => {
        if (version.version_group.name === generation) {
          return attackArray.push(move.move.name);
        }
      });
    });
    attackArray.sort((a, b) => {
      return a.localeCompare(b);
    });
  }
  let uniqueAttacks = [...new Set(attackArray)];

  // Calls the endpoint that will update the currently selected pokemon
  const handleChanges = (id) => {
    const data = {
      trainer: currentUser,
      ability: ability,
      nature: nature,
      iv: ivSpread,
      ev: evSpread,
      stats: [hp, atk, def, spAtk, spDef, spd],
      attacks: attack,
      pokemonId: id,
    };

    fetch("/pokemon/update/", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        setError(resData);
      })
      .catch((err) => navigate("/error"));
  };

  // Calls the endpoint that will delete the currently selected pokemon
  const handleDelete = (id) => {
    const data = {
      trainer: currentUser,
      pokemonId: id,
    };

    fetch("/pokemon/delete/", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resData) => setError(resData))
      .catch((err) => navigate("/error"));
  };

  // Calls the endpoint in order to post an actual build as described by a user
  const handlePost = (pokemon, index, generation, item) => {
    const data = {
      trainer: currentUser,
      name: pokemon,
      id: index,
      generation: generation,
      ability: ability,
      nature: nature,
      level: level,
      item: item,
      iv: ivSpread,
      ev: evSpread,
      stats: [hp, atk, def, spAtk, spDef, spd],
      attacks: attack,
      description: entry,
    };

    fetch("/pokemon/postBuild", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resData) => {
        setError(resData);

        if (resData.status < 299) {
          setEntry("");
          setValue(1000);
        }
      })
      .catch((err) => navigate("/error"));
  };

  if (!profile) {
    return <LoadingPage />;
  }

  return (
    <Container>
      {profile.party.map((member) => {
        // This is necessary in order to use the Pokemon's name as a link to other pages since the saved build may use the mega/gmax name instead of the species name. The extra words are filtered.
        let array = member.pokemon.split("-");
        let exceptions = nameExceptions.some((item) => array.includes(item));
        return (
          <>
            <PokemonContainer
              width={member.entryId === update}
              key={member.entryId}
            >
              <InfoContainer width={member.entryId === update}>
                {exceptions ? (
                  <PokemonLink to={`/pokemon/${member.pokemon.split("-")[0]}`}>
                    {capAndRemoveHyphen(member.pokemon)}
                  </PokemonLink>
                ) : (
                  <PokemonLink to={`/pokemon/${member.pokemon}`}>
                    {capAndRemoveHyphen(member.pokemon)}
                  </PokemonLink>
                )}
                <Info>Index: #{member.index}</Info>
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

                {member.entryId !== update ? (
                  <Info>Nature: {capAndRemoveHyphen(member.nature)}</Info>
                ) : (
                  <>
                    <Label>Nature:</Label>
                    <Select
                      defaultValue={member.nature}
                      onChange={(e) => {
                        changeNatureValues(e.target.value);
                        setNature(e.target.value);
                      }}
                    >
                      <option disabled>Select a nature</option>
                      {natures &&
                        natureArray.map((nature) => {
                          return (
                            <option value={nature} key={nature}>
                              {capAndRemoveHyphen(nature)}
                            </option>
                          );
                        })}
                    </Select>
                  </>
                )}

                {member.entryId !== update ? (
                  <Info>Ability: {capAndRemoveHyphen(member.ability)}</Info>
                ) : (
                  <>
                    <Label>Ability:</Label>
                    <Select
                      defaultValue={member.ability}
                      onChange={(e) => setAbility(e.target.value)}
                    >
                      <option disabled>Select an ability</option>
                      {pokemon &&
                        pokemon.abilities.map((ability) => {
                          return (
                            <option
                              value={ability.ability.name}
                              selected={ability.ability.name === member.ability}
                              key={ability.ability.name}
                            >
                              {capAndRemoveHyphen(ability.ability.name)}
                            </option>
                          );
                        })}
                    </Select>
                  </>
                )}
                <div>
                  <img
                    alt={"Pokemon sprite not available"}
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.index}.png`}
                  />
                </div>
              </InfoContainer>
              <AttackContainer width={member.entryId === update}>
                <Title>Attacks</Title>
                {member.entryId !== update ? (
                  <>
                    {Object.values(member.attacks).map((attack) => {
                      return (
                        <AttackLink
                          to={`/attacks/${attack}`}
                          key={member.entryId + attack}
                        >
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
                        <option disabled>Select an attack:</option>
                        {pokemon &&
                          uniqueAttacks.map((attack) => {
                            return (
                              <option
                                value={attack}
                                selected={attack === member.attacks.atk1}
                                key={`Attack1:${attack}`}
                              >
                                {capAndRemoveHyphen(attack)}
                              </option>
                            );
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
                        <option disabled>Select an attack:</option>
                        {pokemon &&
                          uniqueAttacks.map((attack) => {
                            return (
                              <option
                                value={attack}
                                selected={attack === member.attacks.atk2}
                                key={`Attack2:${attack}`}
                              >
                                {capAndRemoveHyphen(attack)}
                              </option>
                            );
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
                        <option disabled>Select an attack:</option>
                        {pokemon &&
                          uniqueAttacks.map((attack) => {
                            return (
                              <option
                                value={attack}
                                selected={attack === member.attacks.atk3}
                                key={`Attack3:${attack}`}
                              >
                                {capAndRemoveHyphen(attack)}
                              </option>
                            );
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
                        <option disabled>Select an attack:</option>
                        {pokemon &&
                          uniqueAttacks.map((attack) => {
                            return (
                              <option
                                value={attack}
                                selected={attack === member.attacks.atk4}
                                key={`Attack4:${attack}`}
                              >
                                {capAndRemoveHyphen(attack)}
                              </option>
                            );
                          })}
                      </Select>
                    </IndividualAttack>
                  </>
                )}
              </AttackContainer>
              <StatContainer width={member.entryId === update}>
                <Title>Stat Totals</Title>
                {member.entryId !== update ? (
                  <>
                    {Object.keys(member.iv).map((stat, index) => {
                      return (
                        <div key={`Final:${stat}`}>
                          {capAndRemoveHyphen(stat)} : {member.stats[index]}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <Table>
                    <thead>
                      <tr>
                        <TableHead>Stat Name:</TableHead>
                        {Object.keys(member.iv).map((stat, index) => {
                          return (
                            <TableHead key={`Name:${stat}`}>
                              {capAndRemoveHyphen(stat)}
                            </TableHead>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <TableHead>Base Stat</TableHead>
                        {pokemon &&
                          pokemon.stats.map((stat) => {
                            return (
                              <TableCell key={`BaseStat:${stat.stat.name}`}>
                                {stat.base_stat}
                              </TableCell>
                            );
                          })}
                      </tr>
                      <tr>
                        <TableHead>IV</TableHead>
                        {pokemon &&
                          Object.values(ivSpread).map((iv, index) => {
                            let keys = Object.keys(ivSpread);
                            return (
                              <TableCell key={`IV:${index}`}>
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
                              <TableCell key={`EV:${index}`}>
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
                    </tbody>
                  </Table>
                )}
              </StatContainer>
            </PokemonContainer>
            {update === member.entryId ? (
              <TextBoxContainer>
                <TextBox
                  type="text"
                  placeholder="Please describe how your build is used competitively."
                  value={entry}
                  onChange={(e) => {
                    setEntry(e.target.value);
                    setValue(1000 - e.target.value.length);
                  }}
                ></TextBox>
                <WordLimit full={value < 0} empty={value > 250}>
                  Character Limit: {value}
                </WordLimit>
              </TextBoxContainer>
            ) : (
              <></>
            )}
            {!error ? (
              <></>
            ) : error && error.status > 299 && update === member.entryId ? (
              <ErrorContainer error={true}>
                We ran into a problem when submitting your Pokemon! Please check
                the following: {error.message}
              </ErrorContainer>
            ) : error && update !== member.entryId ? (
              <></>
            ) : (
              <ErrorContainer error={false}>{error.message}</ErrorContainer>
            )}
            <ButtonContainer>
              {pokemon && update === member.entryId ? (
                <>
                  <Button onClick={() => handleChanges(member.entryId)}>
                    Update
                  </Button>
                  <Button onClick={() => handleDelete(member.entryId)}>
                    Delete
                  </Button>
                  <Button
                    disabled={value < 0}
                    onClick={() =>
                      handlePost(
                        member.pokemon,
                        member.index,
                        member.generation,
                        member.item
                      )
                    }
                  >
                    Post
                  </Button>
                  <Button
                    onClick={() => {
                      setUpdate("");
                      setValue(1000);
                      setError("");
                      setEntry("");
                      setPokemon("");
                    }}
                  >
                    Finish
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    setUpdate(member.entryId);
                    handleUpdate(
                      member.pokemon,
                      member.nature,
                      member.ability,
                      member.attacks,
                      member.ev,
                      member.iv,
                      member.level,
                      member.generation
                    );
                  }}
                >
                  Make Changes
                </Button>
              )}
            </ButtonContainer>
          </>
        );
      })}
    </Container>
  );
};

export default Profile;

// This is the container that holds the entire page
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

// This is the container that holds each individual pokemon.
const PokemonContainer = styled.div`
  display: flex;
  margin: 1rem auto;
  border: 2px solid black;
  overflow: hidden;

  /* If the pokemon is being updated, the width is expanded to allow for more room. */
  width: ${(props) => (props.width ? "95%" : "40%")};

  /* Flex direction is switched to column on smaller screens */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Container holding the basic information of the pokemon (name, index, level, item, generation, nature, ability)
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  text-align: center;

  /* If the pokemon is being updated, the width is shortened since less room is needed. */
  width: ${(props) => (props.width ? "20%" : "40%")};

  /* Width is adjusted on smaller screens to take up entire div in column view */
  @media (max-width: 912px) {
    margin: auto;
    width: 100%;
  }
`;

// Link to the pokemon's page when clicked
const PokemonLink = styled(Link)`
  text-decoration: underline;
  color: black;
  font-weight: bold;
  margin: 0.2rem;

  &:hover {
    background-color: lightblue;
  }
`;

// Styling for the individual divs holding separate pieces of info
const Info = styled.div`
  margin: 0.2rem;
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

// Container for the 4 attacks of the pokemon
const AttackContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 30%;
  border-left: 0.2rem solid black;
  border-right: 0.2rem solid black;

  /* On smaller screens, since the flex is display, the borders are no longer needed */
  @media (max-width: 912px) {
    margin: 0 auto;
    border: none;
    width: 100%;
  }
`;

// Styled titles of the Attacks and Stat Totals Container
const Title = styled.h1`
  font-weight: bold;
  margin: 0.5rem;
`;

// Link to the attack page of the individual attacks
const AttackLink = styled(Link)`
  text-decoration: underline;
  color: black;
  margin: 0.2rem;

  &:hover {
    background-color: lightblue;
  }
`;

// Styling for the individual divs holding the label and select of each attack
const IndividualAttack = styled.div`
  margin: 1rem;
`;

// Container for the stats of the pokemon
const StatContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  /* When being updated, the width increases to 50% since it is the largest section */
  width: ${(props) => (props.width ? "50%" : "30%")};

  /* On smaller screen, it takes up the full with since the flex orientration is column */
  @media (max-width: 912px) {
    margin: 0 auto;
    width: 100%;
  }
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

// Styling for the container holding the buttons
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

// Styling for the buttons
const Button = styled.button`
  padding: 0.5rem 1rem;
  margin: 1rem;
  color: white;
  background-color: blue;
  border-radius: 10px;

  &:hover {
    background-color: paleturquoise;
  }
`;

// Styling for the div holding the textarea
const TextBoxContainer = styled.div`
  width: 80%;
  margin: auto;
  text-align: center;
`;

// Styling for the textarea
const TextBox = styled.textarea`
  max-width: 90%;
  min-width: 50%;
  text-align: center;
  margin: 0.5rem;
`;

// Styling for the div that holds the word limit available in the comment
const WordLimit = styled.div`
  color: ${(props) => (props.empty ? "black" : props.full ? "red" : "yellow")};
`;

// Container that holds the error messages
const ErrorContainer = styled.div`
  text-align: center;
  width: 30%;
  margin: 1rem auto;
  padding: 1rem 1rem;
  font-size: 1.2rem;
  font-weight: bold;

  border-left: ${(props) =>
    props.error ? "0.2rem solid red" : "0.2rem solid green"};
`;
