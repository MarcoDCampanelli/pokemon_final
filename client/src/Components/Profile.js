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

  useEffect(() => {
    fetch(`/profile/${currentUser}`)
      .then((res) => res.json())
      .then((resData) => setProfile(resData.data));
  }, []);

  const handleUpdate = (name) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((resData) => {
        setPokemon(resData);
      });
  };

  if (!profile) {
    return <LoadingPage />;
  }

  console.log(pokemon);
  console.log(update);
  console.log(ability, nature);

  return (
    <Container>
      {profile.party.map((member) => {
        return (
          <PokemonContainer>
            <InfoContainer>
              <h1>{capAndRemoveHyphen(member.pokemon)}</h1>
              <div>Level: {member.level}</div>
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
              <button
                onClick={() => {
                  setUpdate(member.pokemon);
                  handleUpdate(member.pokemon);
                }}
              >
                Click Me
              </button>
            </div>
          </PokemonContainer>
        );
      })}
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  display: flex;
`;

const PokemonContainer = styled.div`
  display: flex;
  width: 80%;
  margin: 1rem auto;
  border: 2px solid black;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  text-align: center;
  background-color: red;
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
