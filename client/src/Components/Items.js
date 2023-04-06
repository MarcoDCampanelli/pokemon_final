import { useState, useEffect, useContext } from "react";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import LoadingPage from "./LoadingPage";

const Items = () => {
  const [itemList, setItemList] = useState([]);
  const [itemCategory, setItemCategory] = useState("");
  const { capAndRemoveHyphen, items, setItemType, itemCategories } =
    useContext(UserContext);

  useEffect(() => {
    const promises = [];
    if (items) {
      items.forEach((item) => {
        promises.push(
          fetch(`https://pokeapi.co/api/v2/item/${item.name}/`)
            .then((res) => res.json())
            .then((resData) => {
              return resData;
            })
        );
      });
    }
    Promise.all(promises).then((data) => setItemList(data));
  }, [items]);

  return (
    <Container>
      <SelectionContainer>
        <Label>Select Item Category:</Label>
        <Select name="items" onChange={(e) => setItemType(e.target.value)}>
          <option defaultValue={true}>Select item type:</option>
          {itemCategories.map((category) => {
            return <option value={category.value}>{category.name}</option>;
          })}
        </Select>
      </SelectionContainer>
      {items ? (
        itemList.map((item) => {
          return (
            <IndividualItem>
              <Name>
                <span>{capAndRemoveHyphen(item.name)}</span>
                <ImageContainer>
                  <img src={item.sprites.default} />
                </ImageContainer>
              </Name>
              <Description>
                {item.effect_entries.length === 0 ? (
                  <>Missing information</>
                ) : (
                  <>{item.effect_entries[0].effect}</>
                )}
              </Description>
            </IndividualItem>
          );
        })
      ) : (
        <></>
      )}
    </Container>
  );
};

export default Items;

// Container for the entire page
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

// Container for individual Item
const IndividualItem = styled.div`
  display: flex;
  border: 0.2rem solid black;
  border-radius: 5px;
  margin: 0.5rem auto;
  width: 80%;
  text-align: center;
`;

// Name of the item
const Name = styled.div`
  max-width: 20%;
  min-width: 20%;
  border-right: 1px solid black;
`;

// Image container
const ImageContainer = styled.div`
  text-align: center;
`;

// Description of the item's effect in battle
const Description = styled.div`
  margin: auto;
  padding: 0.5rem;
`;

// Container for the label and select options
const SelectionContainer = styled.div`
  text-align: center;
  padding: 0.5rem;
`;

// Styling for the labels
const Label = styled.label`
  margin: 0rem 0.5rem;
`;

// Styling for the labels
const Select = styled.select`
  padding: 0.5rem;
  border: 0.2rem solid black;
  border-radius: 5px;
`;
