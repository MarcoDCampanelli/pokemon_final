import { useContext } from "react";

import styled from "styled-components";
import { UserContext } from "./UserContext";

const StatTable = ({ pokemon }) => {
  const { capAndRemoveHyphen } = useContext(UserContext);

  // This will calculate the stat total of the given pokemon to be used in the graphic
  let statTotal = [];
  pokemon.stats.map((stat) => statTotal.push(stat.base_stat));
  let total = statTotal.reduce((a, b) => {
    return a + b;
  });

  const maxHP = (number) => {
    return (
      Math.floor(0.01 * (2 * number + 31 + Math.floor(0.25 * 252)) * 100) +
      100 +
      10
    );
  };

  const maxStat = (number) => {
    return Math.floor(
      (Math.floor(0.01 * (2 * number + 31 + Math.floor(0.25 * 252)) * 100) +
        5) *
        1.1
    );
  };

  const minStat = (number) => {
    return Math.floor(
      (Math.floor(0.01 * (2 * number + 0 + Math.floor(0.25 * 0)) * 100) + 5) *
        0.9
    );
  };

  const minHP = (number) => {
    return (
      Math.floor(0.01 * (2 * number + 0 + Math.floor(0.25 * 0)) * 100) +
      100 +
      10
    );
  };

  return (
    <Table>
      <tr>
        <StatNameHeader>Stat Name</StatNameHeader>
        <ValueHeader>Value</ValueHeader>
        <StatWeightHeader>Stat Weight</StatWeightHeader>
        <MinMaxHeader>Min/Max Value (L100)</MinMaxHeader>
      </tr>
      {pokemon.stats.map((stat) => {
        if (pokemon.name !== "shedinja" && stat.stat.name === "hp") {
          return (
            <tr>
              <StatName>{capAndRemoveHyphen(stat.stat.name)}</StatName>
              <Value>{stat.base_stat}</Value>
              <td>
                <ColorDiv
                  color={stat.base_stat}
                  style={{ width: `${(stat.base_stat / total) * 100 * 2}%` }}
                ></ColorDiv>
              </td>
              <MinMax>
                {minHP(stat.base_stat)} / {maxHP(stat.base_stat)}
              </MinMax>
            </tr>
          );
        }
        if (pokemon.name === "shedinja" && stat.stat.name === "hp") {
          return (
            <tr>
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
            <tr>
              <StatName>{capAndRemoveHyphen(stat.stat.name)}</StatName>
              <Value>{stat.base_stat}</Value>
              <td>
                <ColorDiv
                  color={stat.base_stat}
                  style={{ width: `${(stat.base_stat / total) * 100 * 2}%` }}
                ></ColorDiv>
              </td>
              <MinMax>
                {minStat(stat.base_stat)} / {maxStat(stat.base_stat)}
              </MinMax>
            </tr>
          );
        }
      })}
    </Table>
  );
};

export default StatTable;

const Table = styled.table`
  border: 0.2rem solid black;
  border-radius: 5px;
  width: 65%;
  margin: 0.5rem auto;

  @media (max-width: 768px) {
    width: 95%;
    margin: 0.5rem auto;
  }
`;

const ColorDiv = styled.div`
  background-color: ${(props) =>
    props.color >= 90 ? "green" : props.color < 50 ? "red" : "yellow"};
  border: 0.1rem solid black;
  height: 1rem;
  align-items: center;
`;

const StatNameHeader = styled.th`
  width: 20%;
`;

const StatName = styled.td`
  text-align: center;
`;

const ValueHeader = styled.th`
  width: 10%;
`;

const Value = styled.td`
  text-align: center;
`;

const StatWeightHeader = styled.th`
  width: 50%;
`;

const MinMaxHeader = styled.th`
  width: 20%;
`;

const MinMax = styled.td`
  text-align: center;
`;
