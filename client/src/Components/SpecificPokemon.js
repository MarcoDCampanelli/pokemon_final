import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";

const SpecificPokemon = () => {
  const id = useParams();
  const [species, setSpecies] = useState("");
  const [pokemon, setPokemon] = useState("");

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id.pokemon}`)
      .then((res) => res.json())
      .then((resData) => {
        setSpecies(resData);
      });

    fetch(`https://pokeapi.co/api/v2/pokemon/${id.pokemon}`)
      .then((res) => res.json())
      .then((resData) => {
        setPokemon(resData);
      });
  }, [id]);

  const testing = (name) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((resData) => setPokemon(resData));
  };

  if (!species) {
    return <>Loading...</>;
  }

  console.log(species);

  return (
    <div>
      <h1>{species.name}</h1>
      {species.varieties.length !== 1 ? (
        species.varieties.map((type) => {
          return (
            <button onClick={() => testing(type.pokemon.name)}>
              {type.pokemon.name}
            </button>
          );
        })
      ) : (
        <></>
      )}
      {pokemon ? <div>{pokemon.name}</div> : <>Sorry</>}
    </div>
  );
};

export default SpecificPokemon;
