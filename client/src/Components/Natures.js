import { useState, useEffect, useContext } from "react";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

const Natures = () => {
  const [natureList, setNatureList] = useState([]);
  const { capAndRemoveHyphen, natures } = useContext(UserContext);

  useEffect(() => {
    const promises = [];
    natures.forEach((nature) => {
      promises.push(
        fetch(`https://pokeapi.co/api/v2/nature/${nature}/`)
          .then((res) => res.json())
          .then((resData) => {
            return resData;
          })
      );
    });
    Promise.all(promises).then((data) => setNatureList(data));
  }, []);

  if (!natureList) {
    return <LoadingPage />;
  }

  return (
    <Container>
      <h1>Nature Chart</h1>
      <Paragraph>
        Every Pokemon has a specific nature. Certain natures will not change a
        Pokemon's stats, but others will. A nature will increase a certain stat
        by 10% and simultaneously decrease another stat by 10%.
      </Paragraph>
      <Table>
        <tr>
          <TableHead>Nature Name</TableHead>
          <TableHead>Stat Increased</TableHead>
          <TableHead>Stat Decreased</TableHead>
        </tr>
        {natureList.map((type) => {
          return (
            <tr>
              <TableCell>{capAndRemoveHyphen(type.name)}</TableCell>
              <TableCell>
                {type.increased_stat === null ? (
                  <>-</>
                ) : (
                  <>{capAndRemoveHyphen(type.increased_stat.name)}</>
                )}
              </TableCell>
              <TableCell>
                {type.decreased_stat === null ? (
                  <>-</>
                ) : (
                  <>{capAndRemoveHyphen(type.decreased_stat.name)}</>
                )}
              </TableCell>
            </tr>
          );
        })}
      </Table>
    </Container>
  );
};

export default Natures;

// Container that holds the entire page
const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 0.5rem;
  margin: 1rem auto;
`;

// Paragrpah explaining how Natures work
const Paragraph = styled.p`
  width: 80%;
  margin: 1rem auto;
`;

// Styling for the whole table
const Table = styled.table`
  margin: 2rem auto;
  width: 80%;
  border: 0.2rem solid black;
`;

// Styling for the titles in the columns
const TableHead = styled.th`
  font-weight: bold;
  padding: 0.5rem;
  border: 0.1rem solid black;
`;

// Styling for each tablecell
const TableCell = styled.td`
  padding: 0.5rem;
  border: 0.1rem solid black;
`;
