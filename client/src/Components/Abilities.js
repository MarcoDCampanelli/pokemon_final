import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

// This component will generate a list of all available abilities
const Abilities = () => {
  const { capAndRemoveHyphen } = useContext(UserContext);
  const [abilityList, setAbilityList] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/ability?offset=0&limit=298")
      .then((res) => res.json())
      .then((resData) => setAbilityList(resData))
      .catch((err) => navigate("/error"));
  }, []);

  if (!abilityList) {
    return <LoadingPage />;
  }

  // This will return the abilities in alphabetical order
  abilityList.results.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <AbilityContainer>
      <Title>Abilities</Title>
      <Paragraph>
        Every Pokemon has access to at least one ability which helps them in
        battle and sometimes even outside of battle. These abilities may
        activate immediately upon entering battle or can be triggered after a
        certain condition is fulfilled. Some Pokemon may naturally have 2
        abilities which are randomly acquired. Certain Pokemon even have hidden
        abilities which are usually more powerful and harder to obtain!
      </Paragraph>
      {abilityList.results.map((ability) => {
        return (
          <AbilityLink
            to={`/abilities/${ability.name}`}
            key={`AbilityList:${ability.name}`}
          >
            {capAndRemoveHyphen(ability.name)}
          </AbilityLink>
        );
      })}
    </AbilityContainer>
  );
};

export default Abilities;

// Container for the entire page
const AbilityContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// Styling for the title
const Title = styled.h1`
  margin: 1rem auto;
  font-weight: bold;
`;

// Paragraph explaining how Abilities work
const Paragraph = styled.p`
  width: 80%;
  margin: 1rem auto;
`;

// Link to the pokemon's page when clicked
const AbilityLink = styled(Link)`
  text-decoration: underline;
  color: black;
  border: 0.1rem solid black;
  border-radius: 5px;
  padding: 0.5rem;
  margin: 0.2rem auto;
  width: 20%;

  &:hover {
    background-color: lightblue;
  }

  /* On smaller screens increase size so that it's more visible */
  @media (max-width: 768px) {
    width: 40%;
  }
`;
