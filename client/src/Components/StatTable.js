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
    <Container>
      <StatAndValue>
        <Test>
          <Title>Stat Name: </Title>
          <div>Value:</div>
        </Test>
        {pokemon.stats.map((stat) => {
          return (
            <Test>
              <StatName>{capAndRemoveHyphen(stat.stat.name)}: </StatName>
              <div>{stat.base_stat}</div>
            </Test>
          );
        })}
      </StatAndValue>
      <BaseStatContainer>
        <Title>Stat Weight:</Title>
        {pokemon.stats.map((stat) => {
          return (
            <ColorDiv
              style={{ width: `${(stat.base_stat / total) * 100}%` }}
            ></ColorDiv>
          );
        })}
      </BaseStatContainer>
      <div>
        <div>Minimum/Maximum Value</div>
        {pokemon.stats.map((stat) => {
          if (pokemon.name !== "shedinja" && stat.stat.name === "hp") {
            return (
              <MinMaxContainer>
                <div>
                  {minHP(stat.base_stat)} / {maxHP(stat.base_stat)}
                </div>
              </MinMaxContainer>
            );
          }
          if (pokemon.name === "shedinja" && stat.stat.name === "hp") {
            return (
              <MinMaxContainer>
                <div>1 / 1</div>
              </MinMaxContainer>
            );
          } else {
            return (
              <MinMaxContainer>
                <div>
                  {minStat(stat.base_stat)} / {maxStat(stat.base_stat)}
                </div>
              </MinMaxContainer>
            );
          }
        })}
      </div>
    </Container>
  );
};

export default StatTable;

const Title = styled.div`
  margin: auto;
`;

const Container = styled.div`
  margin: 2rem;
  display: flex;
  border: 2px solid black;
`;

const StatAndValue = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;

  @media (max-width: 480px) {
    width: 50%;
  }
`;

const ColorDiv = styled.div`
  border: 0.1rem solid black;
  height: 95%;
  background-color: yellow;
`;

const Test = styled.div`
  display: flex;
  justify-content: space-around;
`;

const StatName = styled.div`
  width: 80%;
`;

const BaseStatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
`;

const MinMaxContainer = styled.div`
  display: flex;
  justify-content: right;
`;
