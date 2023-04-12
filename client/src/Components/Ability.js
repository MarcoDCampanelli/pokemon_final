import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";

const Ability = () => {
  const ability = useParams();
  const { capAndRemoveHyphen, nameExceptions } = useContext(UserContext);
  const [abilities, setAbilities] = useState("");

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/ability/${ability.ability}`)
      .then((res) => res.json())
      .then((resData) => setAbilities(resData));
  }, []);

  if (!abilities) {
    return <></>;
  }

  console.log(abilities);

  return <></>;
};

export default Ability;
