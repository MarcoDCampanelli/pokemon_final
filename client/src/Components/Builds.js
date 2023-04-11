import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

const Builds = ({ builds }) => {
  const { currentUser, capAndRemoveHyphen } = useContext(UserContext);
  const [pokemon, setPokemon] = useState("");
  const [comment, setComment] = useState("");
  const [value, setValue] = useState(500);

  if (!builds) {
    return <LoadingPage />;
  }

  console.log(pokemon);

  return (
    <>
      <BuildContainer>
        {builds.data ? (
          builds.data.map((entry) => {
            return (
              <>
                <IndividualBuild>
                  <InfoContainer>
                    <Titles>{capAndRemoveHyphen(entry.pokemon)}</Titles>
                    <Info>Trainer: {entry.trainer}</Info>
                    <Info>Index #: {entry.index}</Info>
                    <Info>Level: {entry.level}</Info>
                    <Info>
                      Item:{" "}
                      {entry.item ? (
                        <>{capAndRemoveHyphen(entry.item)}</>
                      ) : (
                        <>None</>
                      )}
                    </Info>
                    <Info>
                      Generation: {capAndRemoveHyphen(entry.generation)}
                    </Info>
                    <Info>Nature: {capAndRemoveHyphen(entry.nature)}</Info>
                    <Info>Ability: {capAndRemoveHyphen(entry.ability)}</Info>
                    <SpriteContainer>
                      <img
                        alt={"Pokemon"}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.index}.png`}
                      />
                    </SpriteContainer>
                  </InfoContainer>
                  <BuildAttackContainer>
                    <Titles>Attacks</Titles>
                    {Object.values(entry.attacks).map((attack) => {
                      return (
                        <AttackLink to={`/attacks/${attack}`}>
                          {capAndRemoveHyphen(attack)}
                        </AttackLink>
                      );
                    })}
                  </BuildAttackContainer>
                  <StatContainer>
                    <Titles>Stat Investment</Titles>
                    <Table>
                      <tr>
                        <TableHead>Stat Name:</TableHead>
                        {Object.keys(entry.iv).map((stat, index) => {
                          return (
                            <TableHead>{capAndRemoveHyphen(stat)}</TableHead>
                          );
                        })}
                      </tr>
                      <tr>
                        <TableHead>IV</TableHead>
                        {Object.values(entry.iv).map((iv) => {
                          return <TableCell>{iv}</TableCell>;
                        })}
                      </tr>
                      <tr>
                        <TableHead>EV</TableHead>
                        {Object.values(entry.ev).map((ev) => {
                          return <TableCell>{ev}</TableCell>;
                        })}
                      </tr>
                      <tr>
                        <TableHead>Final Stat</TableHead>
                        {entry.stats.map((stat) => {
                          return <TableCell>{stat}</TableCell>;
                        })}
                      </tr>
                    </Table>
                  </StatContainer>
                </IndividualBuild>
                <DescriptionContainer>{entry.description}</DescriptionContainer>
                {pokemon === entry._id ? (
                  <TextBoxContainer>
                    <TextBox
                      type="text"
                      placeholder="Please leave a comment."
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                        setValue(500 - e.target.value.length);
                      }}
                    ></TextBox>
                    <WordLimit full={value < 0} empty={value > 100}>
                      Character Limit: {value}
                    </WordLimit>
                    <Button disabled={value < 0}>Submit</Button>
                  </TextBoxContainer>
                ) : (
                  <></>
                )}
                <ButtonContainer>
                  {currentUser !== entry.trainer ? (
                    <Button>Save Build</Button>
                  ) : (
                    <></>
                  )}
                  {currentUser === entry.trainer ? (
                    <Button>Delete Build</Button>
                  ) : (
                    <></>
                  )}
                  <Button onClick={() => setPokemon(entry._id)}>Comment</Button>
                </ButtonContainer>
              </>
            );
          })
        ) : (
          <></>
        )}
      </BuildContainer>
    </>
  );
};

export default Builds;

const BuildContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 1rem auto;
`;

// Styling for titles
const Titles = styled.h1`
  font-weight: bold;
  margin: 0.3rem;
`;

const IndividualBuild = styled.div`
  display: flex;
  margin: 1rem;
  border: 2px solid black;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// The container holding the male/female sprites
const SpriteContainer = styled.div`
  justify-content: center;
  margin: auto;
  width: 100%;

  @media (max-width: 768px) {
    width: 25%;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 20%;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
    margin: auto;
  }
`;

const BuildAttackContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 20%;
  border-left: 0.2rem solid black;
  border-right: 0.2rem solid black;

  @media (max-width: 768px) {
    width: 100%;
    margin: auto;
    border: none;
  }
`;

const Info = styled.div`
  margin: 0.2rem;
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

const StatContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 100%;
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

const DescriptionContainer = styled.div`
  text-align: center;
  width: 80%;
  margin: auto;
  font-size: 1.2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

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
