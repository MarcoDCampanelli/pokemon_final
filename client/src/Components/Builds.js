import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

const Builds = ({ pokemonId }) => {
  const { currentUser, capAndRemoveHyphen } = useContext(UserContext);
  const [builds, setBuilds] = useState("");
  const [pokemon, setPokemon] = useState("");
  const [comment, setComment] = useState("");
  const [value, setValue] = useState(500);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/pokemon/getBuilds/${pokemonId}`)
      .then((res) => res.json())
      .then((resData) => {
        setBuilds(resData);
      });
  }, [pokemonId, error]);

  // Endpoing called in order to post a comment
  const handlePost = (id) => {
    const data = {
      postId: id,
      trainer: currentUser,
      comment: comment,
    };

    fetch("/pokemon/leaveComment", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        setError(resData);

        if (resData.status < 299) {
          setTimeout(() => {
            setError("");
            setPokemon("");
            setComment("");
          }, 3000);
        }
      });
  };

  const handleDelete = (id) => {
    fetch(`/pokemon/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resData) => {
        setError(resData);

        if (resData.status < 299) {
          setTimeout(() => {
            setError("");
            setPokemon("");
            setComment("");
          }, 3000);
        }
      });
  };

  if (!builds) {
    return <LoadingPage />;
  }

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
                <CommentsContainer>
                  {entry.comments.length === 0 ? (
                    <></>
                  ) : (
                    entry.comments.map((entry) => {
                      const purchaseDate = parseISO(entry.date);
                      const date = format(purchaseDate, "MMM do Y");
                      return (
                        <IndividualComment>
                          <Titles>{entry.trainer}</Titles>
                          <Comment>{entry.comment}</Comment>
                          <Comment>Date: {date}</Comment>
                        </IndividualComment>
                      );
                    })
                  )}
                </CommentsContainer>
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
                    <Button
                      disabled={value < 0}
                      onClick={() => handlePost(entry._id)}
                    >
                      Submit
                    </Button>
                  </TextBoxContainer>
                ) : (
                  <></>
                )}
                {currentUser ? (
                  <ButtonContainer>
                    {currentUser !== entry.trainer ? (
                      <Button>Save Build</Button>
                    ) : (
                      <></>
                    )}
                    {currentUser === entry.trainer ? (
                      <Button
                        onClick={() => {
                          handleDelete(entry._id);
                        }}
                      >
                        Delete Build
                      </Button>
                    ) : (
                      <></>
                    )}
                    <Button onClick={() => setPokemon(entry._id)}>
                      Comment
                    </Button>
                    <Button
                      onClick={() => {
                        setPokemon("");
                        setComment("");
                        setValue(500);
                        setError("");
                      }}
                    >
                      Finish
                    </Button>
                  </ButtonContainer>
                ) : (
                  <></>
                )}
                {/* Delete shows up for all of them.....needs to be fixed..... */}
                {!error ? (
                  <></>
                ) : pokemon === entry._id && error.status > 299 ? (
                  <ErrorContainer error={true}>
                    Should be red 1: {error.message}
                  </ErrorContainer>
                ) : pokemon === entry._id && error.status < 299 ? (
                  <ErrorContainer error={false}>
                    Should be green 2 {error.message}
                  </ErrorContainer>
                ) : !pokemon && error.status > 299 ? (
                  <ErrorContainer error={true}>
                    Should be red 3:{error.message}
                  </ErrorContainer>
                ) : (
                  <ErrorContainer error={false}>
                    Should be green 2 {error.message}
                  </ErrorContainer>
                )}
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

// Container that holds the error messages
const ErrorContainer = styled.div`
  text-align: center;
  width: 30%;
  margin: 1rem auto;
  padding: 1rem 1rem;
  font-size: 1.2rem;
  font-weight: bold;

  border-left: ${(props) =>
    props.error ? "0.2rem solid red" : "0.2rem solid green"};
`;

// Container that holds all of the comments
const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 1rem auto;
  border: 0.2rem solid black;
`;

// Container that holds individual comments
const IndividualComment = styled.div`
  margin: 1rem auto;
  width: 95%;
  border: 0.1rem solid black;
`;

// Container that holds a single comment/date
const Comment = styled.div`
  text-align: left;
  padding: 0.5rem;
`;
