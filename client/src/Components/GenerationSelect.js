import { useContext } from "react";

import styled from "styled-components";
import { UserContext } from "./UserContext";

// This component creates the label/select for the generation on the specific pokemon page using the generations chosen in UserContext
const GenerationSelect = ({ setGeneration }) => {
  const { generations } = useContext(UserContext);

  return (
    <Container>
      <Label>Select the Pokemon Game:</Label>
      <Select
        name="generation"
        defaultValue={true}
        onChange={(e) => {
          setGeneration(e.target.value);
        }}
      >
        <option value={true} disabled>
          Select a game:
        </option>
        {generations.map((generation) => {
          return (
            <option value={generation.value} key={generation.name}>
              {generation.name}
            </option>
          );
        })}
      </Select>
    </Container>
  );
};

export default GenerationSelect;

// Container for the label and select options
const Container = styled.div`
  display: flex;
  margin: 0.5rem;
  justify-content: center;
  align-items: center;
`;

// Styling for the labels
const Label = styled.label`
  margin: 0 0.5rem;
`;

// Styling for the labels
const Select = styled.select`
  padding: 0.5rem;
  border: 0.2rem solid black;
  border-radius: 5px;
`;
