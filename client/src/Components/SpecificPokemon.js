import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import GenerationSelect from "./GenerationSelect";
import Attacks from "./Attacks";
import AlternateAttacks from "./AlternateAttacks";
import StatTable from "./StatTable";
import CreateBuildTable from "./CreateBuildTable";
import Builds from "./Builds";
import LoadingPage from "./LoadingPage";

// This component generates the page of a single pokemon
const SpecificPokemon = () => {
  const id = useParams();
  // Used to navigate to an error page
  const navigate = useNavigate();
  const { capAndRemoveHyphen, returnIcon } = useContext(UserContext);
  // The species of the pokemon determines what gets initially loaded on the page
  const [species, setSpecies] = useState("");
  // The pokemon is either set in the UseEffect if the species matches the name or is set when the person chooses a form
  const [pokemon, setPokemon] = useState("");
  // This will default a generation to "red-blue"
  const [generation, setGeneration] = useState("red-blue");

  // Page load using the species of the pokemon and will also check to see if the species name corresponds to the pokemon's name. If not, pokemon remains undefined
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

  // Choose a pokemon's form and display information unique to the form
  const ChooseForm = (name) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((resData) => setPokemon(resData))
      .catch((err) => {
        navigate("/error");
      });
  };

  if (!species) {
    return <LoadingPage />;
  }

  // Certain info can only be acquired from pokemon and not from species. Therefore, conditional rendering is used in these cases and the user is asked to specify a form

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
              alt={"Pokemon unavailable"}
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
              <IndividialStat>
                Select a form for more information
              </IndividialStat>
            )}
          </InfoCategory>
          <Titles>In-game Mechanics:</Titles>
          <InfoCategory>
            <IndividialStat>
              Capture Rate: {((species.capture_rate / 255) * 100).toFixed(2)}%
            </IndividialStat>
            <IndividialStat>
              Growth Rate:{" "}
              {/* Growth rate was discontinued in gen 9 in the species section so this is the temporary solution until the API is updated. */}
              {species.generation.name !== "generation-ix" ? (
                <>{capAndRemoveHyphen(species.growth_rate.name)}</>
              ) : (
                <>Unknown</>
              )}
            </IndividialStat>
            <IndividialStat>
              {/* Habitat was discontinued in gen 9 in the species section so this is the temporary solution until the API is updated. */}
              Habitat:{" "}
              {species.generation.name === "generation-ix" ||
              species.habitat === null ? (
                <>Unknown</>
              ) : (
                <>{capAndRemoveHyphen(species.habitat.name)}</>
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
              Egg Groups:
              <LinksContainer>
                {species.egg_groups.map((group) => {
                  if (group.name === "no-eggs") {
                    return <>No known egg group</>;
                  } else {
                    return (
                      <AbilityEggLink
                        to={`/eggGroups/${group.name}`}
                        key={group.name}
                      >
                        {capAndRemoveHyphen(group.name)}
                      </AbilityEggLink>
                    );
                  }
                })}
              </LinksContainer>
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
                <LinksContainer>
                  {pokemon.abilities.map((ability, index) => {
                    return (
                      <AbilityEggLink
                        to={`/abilities/${ability.ability.name}`}
                        key={ability.ability.name + index}
                      >
                        {ability.is_hidden
                          ? "Hidden Ability: "
                          : `Regular Ability ${index + 1}: `}
                        {capAndRemoveHyphen(ability.ability.name)}
                      </AbilityEggLink>
                    );
                  })}
                </LinksContainer>
              </IndividialStat>
              <IndividialStat>
                Types:
                <LinksContainer>
                  {pokemon.types.map((type) => {
                    return (
                      <TypeDiv key={type.type.name}>
                        {capAndRemoveHyphen(type.type.name)}{" "}
                        <Icon>{returnIcon(type.type.name)}</Icon>
                      </TypeDiv>
                    );
                  })}
                </LinksContainer>
              </IndividialStat>
            </InfoCategory>
          ) : (
            <IndividialStat>Select a form for more information</IndividialStat>
          )}
        </PokemonInfoContainer>
      </PokemonContainer>
      <FormContainer>
        {species.varieties.length !== 1 ? (
          <>
            <Label>Select a form:</Label>
            <Select
              defaultValue={"default"}
              onChange={(e) => ChooseForm(e.target.value)}
            >
              <option value={"default"} disabled>
                Select a form
              </option>
              {species.varieties.map((type) => {
                return (
                  <option value={type.pokemon.name} key={type.pokemon.name}>
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
          <AttackBuildContainer>
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
          </AttackBuildContainer>
        </>
      ) : (
        <></>
      )}
      <Builds pokemonId={id.pokemon} />
    </Container>
  );
};

export default SpecificPokemon;

// Container for the entire page
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

// Styling for titles of each category and the Pokemon's name
const Titles = styled.h1`
  font-weight: bold;
  margin: 0.5rem auto;
`;

// Container that will hold the box containing both the sprites and the information
const PokemonContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 0.15rem solid grey;
  text-align: center;
  width: 70%;
  margin: 2rem auto;
`;

// The left sided div that holds the images and the sprites
const ArtContainer = styled.div`
  width: 35%;
  padding: auto;
  border-right: 0.15rem solid grey;
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
  width: 65%;
  flex-direction: column;
  background-color: #dbdbdb;
`;

// Container holding the the information for a specific category (physical description, in-game mechanics, hatching info, abilities and type)
const InfoCategory = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0.5rem;
  margin: 0.5rem;
`;

// Container for each individual piece of info in the right-side column
const IndividialStat = styled.div`
  padding: 0.2rem 0.5rem;
`;

// Flex column container to hold and info containing links
const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// Styling for links used in the pokemon's info table
const AbilityEggLink = styled(Link)`
  text-decoration: underline;
  color: black;
  margin: 0.5rem auto;
`;

// Styling for the types (Links may come as a stretch goal)
const TypeDiv = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem auto;
`;

// Styling for the icon of the types
const Icon = styled.span`
  margin-left: 1rem;
  font-size: 1.5rem;
`;

// Container holding the button that allows you to choose a form
const FormContainer = styled.div`
  margin: 2rem auto;
  text-align: center;
`;

// Styling for the labels
const Label = styled.label`
  margin: 0rem 0.5rem;
`;

// Styling for the labels
const Select = styled.select`
  padding: 0.5rem;
  border: 0.1rem solid grey;
  border-radius: 5px;
`;

// Container that holds the list of attacks by level up, special attacks, and the createBuild table
const AttackBuildContainer = styled.div`
  display: flex;
  overflow: hidden;
  justify-content: space-around;
  background-color: #dbdbdb;

  @media (max-width: 950px) {
    flex-direction: column;
  }
`;

// The attack columns that hold the two type of attacks (level-up/special)
const AttackColumn = styled.div`
  margin: 0.5rem;
  text-align: center;
  overflow-y: auto;
  max-height: 750px;
  width: 25%;

  @media (max-width: 950px) {
    width: 50%;
    margin: 2rem auto;
  }
`;
