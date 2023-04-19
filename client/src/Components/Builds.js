import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

// This component will generate a list of builds created by players and post them to the pokemon page
const Builds = ({ pokemonId }) => {
  const { currentUser, capAndRemoveHyphen } = useContext(UserContext);
  const navigate = useNavigate();
  // This state stores all builds of this pokemon made by users
  const [builds, setBuilds] = useState("");
  // The following 2 states are here to be set in order to make sure the error message is displayed in the right spot. One state is used when commenting, the other when deleting/saving the build
  // deletePokemon is used when saving / deleting a certain entry
  const [pokemon, setPokemon] = useState("");
  const [deletePokemon, setDeletePokemon] = useState("");

  // These states store information for messages to be posted
  const [comment, setComment] = useState("");
  const [value, setValue] = useState(500);
  // This state is used should an error occur
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/pokemon/getBuilds/${pokemonId}`)
      .then((res) => res.json())
      .then((resData) => {
        setBuilds(resData);
      })
      .catch((err) => navigate("/error"));
  }, [pokemonId, error]);

  // Endpoint called in order to post a comment
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

        // If the error status is less than 299, it will display and then clear itself else it'll stay so that the user can read it and modify their comment accordingly
        if (resData.status < 299) {
          setTimeout(() => {
            setError("");
            setPokemon("");
            setComment("");
            setValue(500);
          }, 2000);
        }
      })
      .catch((error) => navigate("/error"));
  };

  // Endpoint called in order to delete a build should the creator choose to do so
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
            setValue(500);
          }, 2000);
        }
      })
      .catch((error) => navigate("/error"));
  };

  // This is the same endpoing called in CreateBuildTable to add a pokemon to the party. However, in this case, it will add it to the signed in user's party.
  const handleAddToParty = (
    name,
    index,
    generation,
    ability,
    nature,
    level,
    item,
    ivSpread,
    evSpread,
    statSpread,
    attackList
  ) => {
    const data = {
      trainer: currentUser,
      name: name,
      id: index,
      generation: generation,
      ability: ability,
      nature: nature,
      level: level,
      item: item,
      iv: ivSpread,
      ev: evSpread,
      stats: statSpread,
      attacks: attackList,
    };

    fetch("/pokemonPartyAddition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resData) => {
        setError(resData);

        if (resData.status < 299) {
          setTimeout(() => {
            setError("");
          }, 2000);
        }
      })
      .catch((error) => navigate("/error"));
  };

  if (!builds) {
    return <LoadingPage />;
  }

  return (
    <BuildContainer>
      {builds.data ? (
        builds.data.map((entry, index) => {
          return (
            <div key={`entry:${index}`}>
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
                      <AttackLink
                        to={`/attacks/${attack}`}
                        key={`PostedBuild:${attack}`}
                      >
                        {capAndRemoveHyphen(attack)}
                      </AttackLink>
                    );
                  })}
                </BuildAttackContainer>
                <StatContainer>
                  <Titles>Stat Investment</Titles>
                  <Table>
                    <thead>
                      <tr>
                        <TableHead>Stat Name:</TableHead>
                        {Object.keys(entry.iv).map((stat) => {
                          return (
                            <TableHead key={`PostedBuildTitle:${stat}`}>
                              {capAndRemoveHyphen(stat)}
                            </TableHead>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <TableHead>IV</TableHead>
                        {Object.values(entry.iv).map((iv, index) => {
                          return (
                            <TableCell key={`PostedBuildIV:${index}`}>
                              {iv}
                            </TableCell>
                          );
                        })}
                      </tr>
                      <tr>
                        <TableHead>EV</TableHead>
                        {Object.values(entry.ev).map((ev, index) => {
                          return (
                            <TableCell key={`PostedBuildEV:${index}`}>
                              {ev}
                            </TableCell>
                          );
                        })}
                      </tr>
                      <tr>
                        <TableHead>Final Stat</TableHead>
                        {entry.stats.map((stat) => {
                          return (
                            <TableCell key={`PostedBuildFinalStat:${stat}`}>
                              {stat}
                            </TableCell>
                          );
                        })}
                      </tr>
                    </tbody>
                  </Table>
                </StatContainer>
              </IndividualBuild>
              <DescriptionContainer>{entry.description}</DescriptionContainer>
              <CommentsContainer border={entry.comments.length === 0}>
                {entry.comments.length === 0 ? (
                  <></>
                ) : (
                  entry.comments.map((comment, index) => {
                    const purchaseDate = parseISO(comment.date);
                    const date = format(purchaseDate, "MMM do Y");

                    return (
                      <IndividualComment key={entry._id + index}>
                        <TrainerComment>
                          Trainer: {comment.trainer}
                        </TrainerComment>
                        <DateComment>{date}</DateComment>
                        <Comment>{comment.comment}</Comment>
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
              {/* Only logged in users can comment/save builds. If the currentUser is the same person who made the build, they'll be able to delete it. If not, they can save it for themselves. */}
              {currentUser ? (
                <ButtonContainer>
                  {currentUser !== entry.trainer ? (
                    <Button
                      onClick={() => {
                        setDeletePokemon(entry._id);
                        handleAddToParty(
                          entry.pokemon,
                          entry.index,
                          entry.generation,
                          entry.ability,
                          entry.nature,
                          entry.level,
                          entry.item,
                          entry.iv,
                          entry.ev,
                          entry.stats,
                          entry.attacks
                        );
                      }}
                    >
                      Save Build
                    </Button>
                  ) : (
                    <></>
                  )}
                  {currentUser === entry.trainer ? (
                    <Button
                      onClick={() => {
                        setDeletePokemon(entry._id);
                        handleDelete(entry._id);
                      }}
                    >
                      Delete Build
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button
                    onClick={() => {
                      setPokemon(entry._id);
                      setComment("");
                      setValue(500);
                      setError("");
                    }}
                  >
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
              {/* If there is no error, show nothing. If the error exists and the pokemon state === entry._id, and the status is an error, display error, else display success message, else display nothing.  */}
              {!error ? (
                <></>
              ) : pokemon === entry._id && error.status > 299 ? (
                <ErrorContainer error={true}>{error.message}</ErrorContainer>
              ) : pokemon === entry._id && error.status < 299 ? (
                <ErrorContainer error={false}>{error.message}</ErrorContainer>
              ) : (
                <></>
              )}
              {/* If there is no error, show nothing. If the error exists and the deletePokemon state === entry._id, and the status is an error, display error, else display success message, else display nothing.  */}
              {!error ? (
                <></>
              ) : !pokemon &&
                error.status > 299 &&
                deletePokemon === entry._id ? (
                <ErrorContainer error={true}>{error.message}</ErrorContainer>
              ) : !pokemon &&
                error.status < 299 &&
                deletePokemon === entry._id ? (
                <ErrorContainer error={false}>{error.message}</ErrorContainer>
              ) : (
                <></>
              )}
            </div>
          );
        })
      ) : (
        <></>
      )}
    </BuildContainer>
  );
};

export default Builds;

// Container that holds all of the builds and the comments of each
const BuildContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 1rem auto;
`;

// Container that holds a single posted build
const IndividualBuild = styled.div`
  display: flex;
  margin: 2rem;
  width: 95%;
  border: 0.1rem solid grey;
  overflow: hidden;

  /* On smaller screes, flex-direction is switched to column */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Styling for the container on the left hand side that holds name, trainer, index, level, item, generation, nature and ability
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 20%;
  text-align: center;

  /* On smaller screens, after flex-column, it is centered */
  @media (max-width: 768px) {
    width: 100%;
    margin: auto;
  }
`;

// Styling for titles in each section of the build and the name of the user who posted a comment
const Titles = styled.h1`
  font-weight: bold;
  margin: 0.5rem;
`;

// Individual pieces of info from first container
const Info = styled.div`
  margin: 0.5rem;
`;

// The container holding the sprite
const SpriteContainer = styled.div`
  justify-content: center;
  margin: auto;
  width: 100%;

  @media (max-width: 768px) {
    width: 25%;
  }
`;

// The center container of the build that holds the attacks
const BuildAttackContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 20%;
  border-left: 0.1rem solid grey;
  border-right: 0.1rem solid grey;

  /* On smaller screens, because of flex-column, the borders are no longer needed */
  @media (max-width: 768px) {
    width: 100%;
    margin: auto;
    border: none;
  }
`;

// Link to the attack page of the individual attacks
const AttackLink = styled(Link)`
  text-decoration: underline;
  color: black;
  margin: 0.5rem;

  &:hover {
    color: #217ebc;
  }
`;

// Container that holds the table that displays the stat spread
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

// Container for the description written by the person who posted the build
const DescriptionContainer = styled.div`
  text-align: center;
  margin: 2rem;
  width: 95%;
  padding: 1rem 0;
  font-size: 1.2rem;
  border: 0.1rem solid grey;
`;

// Container that holds all of the comments
const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 2rem;

  border: ${(props) => (props.border ? "none" : "0.1rem solid grey")};
`;

// Container that holds individual comments
const IndividualComment = styled.div`
  margin: 1rem auto;
  padding-top: 1rem;
  width: 95%;
`;

// Styling for the name of the user commenting
const TrainerComment = styled.span`
  margin-left: 0.5rem;
  font-weight: bold;
`;

// Styling for the date the comment was posted
const DateComment = styled.span`
  font-size: 0.8rem;
  margin-left: 1rem;
`;

// Container that holds a single comment
const Comment = styled.div`
  text-align: left;

  border: 0.1rem solid grey;
  margin: 0.5rem auto;
  padding: 1rem;
`;

// Styling for the container holding all of the buttons
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 4rem;
`;

// Styling for individual buttons
const Button = styled.button`
  padding: 0.5rem 1rem;
  margin: 1rem;
  border-radius: 5px;
  background-image: linear-gradient(to right, #9acbed, #217ebc);

  &:hover {
    color: white;
    background-image: linear-gradient(to right, #217ebc, #033a5e);
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
  min-height: 100px;
  text-align: center;
  margin: 0.5rem;
`;

// Styling for the div that holds the word limit available in the comment
const WordLimit = styled.div`
  color: ${(props) => (props.empty ? "black" : props.full ? "red" : "#ffc005")};
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
