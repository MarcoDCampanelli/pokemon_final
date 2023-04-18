import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

// This component will generate a list of all natures and their advantages/disadvantages
const Natures = () => {
  const navigate = useNavigate();
  const [natureList, setNatureList] = useState([]);
  const { capAndRemoveHyphen, natures } = useContext(UserContext);

  // The list of natures is provided by UserContext. For each nature, a fetch request will be made and that promise stored in the array.Then, once all promises are resolved, the information will be stored in the SetNatureList
  useEffect(() => {
    const promises = [];
    if (natures) {
      natures.forEach((nature) => {
        promises.push(
          fetch(`https://pokeapi.co/api/v2/nature/${nature}/`)
            .then((res) => res.json())
            .then((resData) => {
              return resData;
            })
            .catch((err) => navigate("/error"))
        );
      });
    }
    Promise.all(promises).then((data) => setNatureList(data));
  }, [natures]);

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
        <thead>
          <tr>
            <TableHead>Nature Name</TableHead>
            <TableHead>Stat Increased</TableHead>
            <TableHead>Stat Decreased</TableHead>
          </tr>
        </thead>
        <tbody>
          {natureList.map((type) => {
            return (
              <tr key={type.name}>
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
        </tbody>
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

// Paragraph explaining how Natures work
const Paragraph = styled.p`
  width: 80%;
  margin: 1rem auto;
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
`;

// Styling for each tablecell
const TableCell = styled.td`
  padding: 0.5rem;
  border: 0.1rem solid grey;
`;
