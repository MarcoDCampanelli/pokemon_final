import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";

const SpecificPokemon = () => {
  const id = useParams();
  const [pokemon, setPokemon] = useState("");

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id.pokemon}`)
      .then((res) => res.json())
      .then((resData) => {
        setPokemon(resData);
      });
  }, []);

  if (!pokemon) {
    return <>Loading...</>;
  }

  return <>{pokemon.name}</>;
};

export default SpecificPokemon;
