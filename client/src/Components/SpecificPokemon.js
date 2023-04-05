import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import GenerationSelect from "./GenerationSelect";
import Attacks from "./Attacks";
import AlternateAttacks from "./AlternateAttacks";
import StatTable from "./StatTable";
import CreateBuildTable from "./CreateBuildTable";
import LoadingPage from "./LoadingPage";

const SpecificPokemon = () => {
  const id = useParams();
  const navigate = useNavigate();
  const { capAndRemoveHyphen } = useContext(UserContext);
  const [species, setSpecies] = useState("");
  const [pokemon, setPokemon] = useState("");
  const [generation, setGeneration] = useState("red-blue");

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id.pokemon}`)
      .then((res) => res.json())
      .then((resData) => {
        setSpecies(resData);
      })
      .catch((err) => {
        navigate("/error");
      });

    fetch(`https://pokeapi.co/api/v2/pokemon/${id.pokemon}`)
      .then((res) => res.json())
      .then((resData) => {
        setPokemon(resData);
      });
  }, [id]);

  const ChooseForm = (name) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((resData) => setPokemon(resData));
  };

  if (!species) {
    return <LoadingPage />;
  }

  return (
    <Container>
      <PokemonContainer>
        <ArtContainer>
          <Titles>Pokemon: {capAndRemoveHyphen(species.name)}</Titles>
          <Titles>Index #: {species.id}</Titles>
          {pokemon ? (
            <OfficialArtWork
              src={pokemon.sprites.other["official-artwork"].front_default}
            />
          ) : (
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.id}.png`}
            />
          )}
          {pokemon ? (
            <>
              <h1>Regular sprite:</h1>
              <SpriteContainer>
                <Sprites src={pokemon.sprites.front_default} />
                {!species.has_gender_differences ? (
                  <></>
                ) : pokemon.sprites.front_female ? (
                  <Sprites src={pokemon.sprites.front_female} />
                ) : (
                  <></>
                )}
              </SpriteContainer>
              <h1>Shiny sprite:</h1>
              <Sprites src={pokemon.sprites.front_shiny} />
            </>
          ) : (
            <></>
          )}
        </ArtContainer>
        <PokemonInfoContainer>
          <Titles>Physical Description:</Titles>
          <InfoCategory>
            <IndividialStat>
              Colour: {capAndRemoveHyphen(species.color.name)}
            </IndividialStat>
            <IndividialStat>
              Gender differences:{" "}
              {species.has_gender_differences ? <>True</> : <>None</>}
            </IndividialStat>
            <IndividialStat>
              Shape:{" "}
              {species.shape ? (
                <>{capAndRemoveHyphen(species.shape.name)}</>
              ) : (
                <>Unknown</>
              )}
            </IndividialStat>
            {pokemon ? (
              <>
                <IndividialStat>Weight: {pokemon.weight / 10}kg</IndividialStat>
                <IndividialStat>Height: {pokemon.height / 10}m</IndividialStat>
              </>
            ) : (
              <>Select a form for more information</>
            )}
          </InfoCategory>
          <Titles>In-game Mechanics:</Titles>
          <InfoCategory>
            <IndividialStat>
              Capture Rate: {((species.capture_rate / 255) * 100).toFixed(2)}%
            </IndividialStat>
            <IndividialStat>
              Level rate: {capAndRemoveHyphen(species.growth_rate.name)}
            </IndividialStat>
            <IndividialStat>
              Habitat:
              {species.habitat.name ? (
                <> {capAndRemoveHyphen(species.habitat.name)}</>
              ) : (
                <>Unknown</>
              )}
            </IndividialStat>
            <IndividialStat>
              Base Happiness: {species.base_happiness}
            </IndividialStat>
            {pokemon ? (
              <IndividialStat>
                Experience yield: {pokemon.base_experience} exp
              </IndividialStat>
            ) : (
              <></>
            )}
          </InfoCategory>
          <Titles>Hatching Information:</Titles>
          <InfoCategory>
            <IndividialStat>
              Egg Groups:{" "}
              {species.egg_groups.map((group) => {
                if (group.name === "no-eggs") {
                  return <>No known egg group</>;
                } else {
                  return <div>{capAndRemoveHyphen(group.name)}</div>;
                }
              })}
            </IndividialStat>

            <IndividialStat>
              Hatch counter: {species.hatch_counter * 256} steps
            </IndividialStat>
          </InfoCategory>
          <Titles>Abilities and Type</Titles>
          {pokemon ? (
            <InfoCategory>
              <IndividialStat>
                Abilities:
                {pokemon.abilities.map((ability, index) => {
                  return (
                    <p key={index}>
                      {ability.is_hidden
                        ? "Hidden Ability: "
                        : `Regular Ability ${index + 1}: `}
                      {capAndRemoveHyphen(ability.ability.name)}
                    </p>
                  );
                })}
              </IndividialStat>
              <IndividialStat>
                Type:
                {pokemon.types.map((type) => {
                  return <p>{capAndRemoveHyphen(type.type.name)} </p>;
                })}
              </IndividialStat>
            </InfoCategory>
          ) : (
            <>Select a form for more information</>
          )}
        </PokemonInfoContainer>
      </PokemonContainer>
      <FormContainer>
        {species.varieties.length !== 1 ? (
          <>
            <Label>Select a form:</Label>
            <Select onChange={(e) => ChooseForm(e.target.value)}>
              <option selected disabled>
                Select a form
              </option>
              {species.varieties.map((type) => {
                return (
                  <option value={type.pokemon.name}>
                    {capAndRemoveHyphen(type.pokemon.name)}
                  </option>
                );
              })}
            </Select>
          </>
        ) : (
          <></>
        )}
      </FormContainer>
      {pokemon ? <StatTable pokemon={pokemon} /> : <></>}
      {pokemon ? <GenerationSelect setGeneration={setGeneration} /> : <></>}
      {pokemon ? (
        <>
          <AttackContainer>
            <AttackColumn>
              <Attacks pokemon={pokemon} generation={generation} />
            </AttackColumn>
            <AttackColumn>
              <AlternateAttacks pokemon={pokemon} generation={generation} />
            </AttackColumn>
            <CreateBuildTable
              pokemonStats={pokemon.stats}
              pokemon={pokemon}
              generation={generation}
            />
          </AttackContainer>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default SpecificPokemon;

// Container for the entire page
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

// Styling for titles
const Titles = styled.h1`
  font-weight: bold;
  margin: 0.3rem;
`;

// Container that will hold the box containing the images and the information of the pokemon
const PokemonContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 2px solid black;
  text-align: center;
  width: 70%;
  margin: 1rem auto;
`;

// The left sided div that holds the images
const ArtContainer = styled.div`
  width: 30%;
  padding: auto;
  border-right: 0.2rem solid black;
`;

// The large official artwork of the pokemon
const OfficialArtWork = styled.img`
  width: 50%;
`;

// The sprites of the pokemon
const Sprites = styled.img`
  width: 30%;
`;

// The container holding the male/female sprites
const SpriteContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

// The right sided div that holds the information of the pokemon
const PokemonInfoContainer = styled.div`
  display: flex;
  width: 70%;
  flex-direction: column;
`;

// Container holding the the information for a specific category
const InfoCategory = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0.5rem;
  margin: 0.5rem;
`;

// Container for each stat and div
const IndividialStat = styled.div`
  padding: 0.2rem 0.5rem;
`;

// Container holding the buttons that allow you to choose a form
const FormContainer = styled.div`
  text-align: center;
`;

// Styling for the labels
const Label = styled.label`
  margin: 0rem 0.5rem;
`;

// Styling for the labels
const Select = styled.select`
  padding: 0.5rem;
  border: 0.2rem solid black;
  border-radius: 5px;
`;

const AttackContainer = styled.div`
  display: flex;
  overflow: hidden;
  justify-content: space-around;

  @media (max-width: 768px) {
    flex-direction: column;
    margin: auto;
  }
`;

const AttackColumn = styled.div`
  margin: 0.5rem;
  text-align: center;
  overflow-y: auto;
  max-height: 500px;
  width: 25%;

  @media (max-width: 768px) {
    width: 50%;
    margin: 0.5rem auto;
  }
`;
