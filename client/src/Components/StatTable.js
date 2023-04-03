import styled from "styled-components";

const StatTable = ({ pokemon }) => {
  let statTotal = [];
  pokemon.stats.map((stat) => statTotal.push(stat.base_stat));
  let total = statTotal.reduce((a, b) => {
    return a + b;
  });
  console.log(total);

  return (
    <Container>
      {pokemon.stats.map((stat) => {
        return (
          <Flex>
            <Stat>
              {stat.stat.name}: {stat.base_stat}
            </Stat>
            <ColorDiv></ColorDiv>
          </Flex>
        );
      })}
    </Container>
  );
};

export default StatTable;

const Container = styled.div`
  margin: 2rem;
  border: 2px solid black;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
`;

const Stat = styled.div`
  background-color: red;
  width: 30%;
`;

const ColorDiv = styled.div`
  width: 100%;
  border: 1px solid black;
  background-color: yellow;
`;
