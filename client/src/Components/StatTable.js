import { useContext } from "react";

import styled from "styled-components";
import { UserContext } from "./UserContext";

// This component generates the Stat respresentation of the given Pokemon
const StatTable = ({ pokemon }) => {
  const { capAndRemoveHyphen, calculateStat, calculateHealth } =
    useContext(UserContext);

  // This will calculate the stat total of the given pokemon to be used in the graphic in order to generate the relative bars for each stat
  let statTotal = [];
  pokemon.stats.map((stat) => statTotal.push(stat.base_stat));
  let total = statTotal.reduce((a, b) => {
    return a + b;
  });

  return (
    <Table>
      <thead>
        <tr>
          <StatNameHeader>Stat Name</StatNameHeader>
          <ValueHeader>Value</ValueHeader>
          <StatWeightHeader>Stat Weight</StatWeightHeader>
          <MinMaxHeader>Min/Max Value (L100)</MinMaxHeader>
        </tr>
      </thead>
      <tbody>
        {pokemon.stats.map((stat) => {
          if (pokemon.name !== "shedinja" && stat.stat.name === "hp") {
            return (
              <tr key={stat.stat.name}>
                <StatName>{capAndRemoveHyphen(stat.stat.name)}</StatName>
                <Value>{stat.base_stat}</Value>
                <td>
                  <ColorDiv
                    color={stat.base_stat}
                    style={{ width: `${(stat.base_stat / total) * 100 * 2}%` }}
                  ></ColorDiv>
                </td>
                <MinMax>
                  {calculateHealth(stat.base_stat, 0, 0, 100)} /{" "}
                  {calculateHealth(stat.base_stat, 31, 252, 100)}
                </MinMax>
              </tr>
            );
          }
          if (pokemon.name === "shedinja" && stat.stat.name === "hp") {
            return (
              <tr key={stat.stat.name}>
                <StatName>{capAndRemoveHyphen(stat.stat.name)}</StatName>
                <Value>{stat.base_stat}</Value>
                <td>
                  <ColorDiv
                    color={stat.base_stat}
                    style={{ width: `${(stat.base_stat / total) * 100 * 2}%` }}
                  ></ColorDiv>
                </td>
                <MinMax>1 / 1</MinMax>
              </tr>
            );
          } else {
            return (
              <tr key={stat.stat.name}>
                <StatName>{capAndRemoveHyphen(stat.stat.name)}</StatName>
                <Value>{stat.base_stat}</Value>
                <td>
                  <ColorDiv
                    color={stat.base_stat}
                    style={{ width: `${(stat.base_stat / total) * 100 * 2}%` }}
                  ></ColorDiv>
                </td>
                <MinMax>
                  {calculateStat(stat.base_stat, 0, 0, 100, 0.9)} /{" "}
                  {calculateStat(stat.base_stat, 31, 252, 100, 1.1)}
                </MinMax>
              </tr>
            );
          }
        })}
      </tbody>
    </Table>
  );
};

export default StatTable;

// Container for the entire table
const Table = styled.table`
  border: 0.15rem solid grey;
  width: 70%;
  margin: 1rem auto;

  @media (max-width: 768px) {
    width: 95%;
    margin: 0.5rem auto;
  }
`;

// The colored div showing the weight of a stat
const ColorDiv = styled.div`
  background-color: ${(props) =>
    props.color >= 90 ? "green" : props.color < 50 ? "red" : "yellow"};
  border: 0.1rem solid black;
  height: 1rem;
  align-items: center;
`;

// Header for the first column
const StatNameHeader = styled.th`
  width: 20%;
  padding: 0.5rem 0;
  font-weight: bold;
`;

// List of stats in the first column
const StatName = styled.td`
  text-align: center;
  padding: 0.5rem 0;
`;

// Header for the second column
const ValueHeader = styled.th`
  width: 10%;
  font-weight: bold;
`;

// List of the values in the second column
const Value = styled.td`
  text-align: center;
`;

// Title for the third column showing stat weight through bars
const StatWeightHeader = styled.th`
  width: 50%;
  font-weight: bold;
`;

// Title for the fourth column
const MinMaxHeader = styled.th`
  width: 20%;
  font-weight: bold;
`;

// List of the values to show min/max of a stat
const MinMax = styled.td`
  text-align: center;
`;
