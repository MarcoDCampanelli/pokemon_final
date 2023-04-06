import { useContext } from "react";

import styled from "styled-components";
import { UserContext } from "./UserContext";

const GenerationSelect = ({ setGeneration }) => {
  const { generations } = useContext(UserContext);

  return (
    <Container>
      <Label>Select the Pokemon Game:</Label>
      <Select
        name="generation"
        onChange={(e) => {
          setGeneration(e.target.value);
        }}
      >
        <option defaultValue={true} disabled>
          Select a game:
        </option>
        {generations.map((generation) => {
          return <option value={generation.value}>{generation.name}</option>;
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
  align-items: middle;
  justify-content: center;
  align-items: center;
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
