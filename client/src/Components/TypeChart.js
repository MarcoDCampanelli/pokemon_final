import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

const TypeChart = () => {
  const { types, capAndRemoveHyphen } = useContext(UserContext);
  const [typeList, setTypeList] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const promises = [];
    if (types) {
      types.forEach((type) => {
        promises.push(
          fetch(`https://pokeapi.co/api/v2/type/${type}/`)
            .then((res) => res.json())
            .then((resData) => {
              return resData;
            })
            .catch((err) => navigate("/error"))
        );
      });
    }
    Promise.all(promises).then((data) => setTypeList(data));
  }, [types]);

  let newTypeChart = {};

  if (types && typeList.length !== 0) {
    types.map((type, index) => {
      newTypeChart[type] = {
        doubleDamageFrom: typeList[
          index
        ].damage_relations.double_damage_from.map((entry) => {
          return entry.name;
        }),
        doubleDamageTo: typeList[index].damage_relations.double_damage_to.map(
          (entry) => {
            return entry.name;
          }
        ),
        halfDamageTo: typeList[index].damage_relations.half_damage_to.map(
          (entry) => {
            return entry.name;
          }
        ),
        halfDamageFrom: typeList[index].damage_relations.half_damage_from.map(
          (entry) => {
            return entry.name;
          }
        ),
        noDamageTo: typeList[index].damage_relations.no_damage_to.map(
          (entry) => {
            return entry.name;
          }
        ),
        noDamageFrom: typeList[index].damage_relations.no_damage_from.map(
          (entry) => {
            return entry.name;
          }
        ),
      };
    });
  }

  if (!types && !typeList) {
    return <LoadingPage />;
  }

  return (
    <TypeContainer>
      <Title>Offensive Table Chart</Title>
      <Paragraph>
        This chart represents the offensive capabilties of each type and should
        be read from left to right. A green box means that the type will deal
        double damage to opposing type while a red box means that the type will
        deal half damage to the opposing type. A grey box means that this type
        can never deal damage to the opposing type since they are immune.
      </Paragraph>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHead>Types:</TableHead>
              {types &&
                types.map((type) => {
                  return (
                    <TableHead key={`OffensiveChart${type}`}>
                      {capAndRemoveHyphen(type)}
                    </TableHead>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {types ? (
              types.map((type) => {
                return (
                  <tr key={`RowOffense${type}`}>
                    <TableHead>{capAndRemoveHyphen(type)}</TableHead>
                    {newTypeChart[type] &&
                      types.map((type2, index) => {
                        if (newTypeChart[type].doubleDamageTo.includes(type2)) {
                          return (
                            <TableCell
                              color={"strong"}
                              key={`Offense${type}${index}${type2}`}
                            >
                              x2
                            </TableCell>
                          );
                        } else if (
                          newTypeChart[type].halfDamageTo.includes(type2)
                        ) {
                          return (
                            <TableCell
                              color={"weak"}
                              key={`Offense${type}${index}${type2}`}
                            >
                              x0.5
                            </TableCell>
                          );
                        } else if (
                          newTypeChart[type].noDamageTo.includes(type2)
                        ) {
                          return (
                            <TableCell
                              color={"immune"}
                              key={`Offense${type}${index}${type2}`}
                            >
                              x0
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell key={`Offense${type}${index}${type2}`}>
                              -
                            </TableCell>
                          );
                        }
                      })}
                  </tr>
                );
              })
            ) : (
              <></>
            )}
          </tbody>
        </Table>
      </TableContainer>
      <Title>Defensive Table Chart</Title>
      <Paragraph>
        This chart represents the defensive capabilties of each type and should
        be read from left to right. A green box means that the type resists the
        opposing type and will take half damage while a red box means that the
        type will take double damage from the opposing type. A grey box means
        that the type is immune to all attacks from the opposing type.
      </Paragraph>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHead>Types:</TableHead>
              {types &&
                types.map((type) => {
                  return (
                    <TableHead key={`DefensiveChart${type}`}>
                      {capAndRemoveHyphen(type)}
                    </TableHead>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {types ? (
              types.map((type) => {
                return (
                  <tr key={`RowDefense${type}`}>
                    <TableHead key={`DefensiveChart${type}`}>
                      {capAndRemoveHyphen(type)}
                    </TableHead>
                    {newTypeChart[type] &&
                      types.map((type2, index) => {
                        if (
                          newTypeChart[type].doubleDamageFrom.includes(type2)
                        ) {
                          return (
                            <TableCell
                              color={"weak"}
                              key={`Defense${type}${index}${type2}`}
                            >
                              x2
                            </TableCell>
                          );
                        } else if (
                          newTypeChart[type].halfDamageFrom.includes(type2)
                        ) {
                          return (
                            <TableCell
                              color={"strong"}
                              key={`Defense${type}${index}${type2}`}
                            >
                              x0.5
                            </TableCell>
                          );
                        } else if (
                          newTypeChart[type].noDamageFrom.includes(type2)
                        ) {
                          return (
                            <TableCell
                              color={"immune"}
                              key={`Defense${type}${index}${type2}`}
                            >
                              x0
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell key={`Defense${type}${index}${type2}`}>
                              -
                            </TableCell>
                          );
                        }
                      })}
                  </tr>
                );
              })
            ) : (
              <></>
            )}
          </tbody>
        </Table>
      </TableContainer>
    </TypeContainer>
  );
};

export default TypeChart;

// Container for the entire page
const TypeContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// Styling for the title
const Title = styled.h1`
  font-size: 2rem;
  margin: 2rem 0;
  text-align: center;
`;

// Paragraph explaining how the tables can be read
const Paragraph = styled.p`
  width: 70%;
  margin: 2rem auto;
  line-height: 3vh;
`;

// Table container
const TableContainer = styled.div`
  overflow: auto;
`;

// Styling for the whole table
const Table = styled.table`
  margin: 2rem auto;
  width: 80%;
  border: 0.15rem solid black;
`;

// Styling for the titles in the columns
const TableHead = styled.th`
  font-weight: bold;
  padding: 0.5rem;
  border: 0.1rem solid grey;
  background-color: #dbdbdb;
`;

// Styling for each tablecell
const TableCell = styled.td`
  padding: 0.5rem;
  border: 0.1rem solid grey;

  background-color: ${(props) =>
    props.color === "strong"
      ? "#83bf8f"
      : props.color === "weak"
      ? "#f68a89"
      : props.color === "immune"
      ? "#9b9b9b"
      : "white"};
`;
