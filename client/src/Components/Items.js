import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "./UserContext";

// This component is used to render the list of items depending on a given category
const Items = () => {
  const [itemList, setItemList] = useState([]);
  const { capAndRemoveHyphen, items, setItemType, itemCategories } =
    useContext(UserContext);
  const navigate = useNavigate();

  //Using the list from UserContext, a fetch request for each item will be done. Once completed, it will be stored in itemList
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
            .catch((err) => navigate("/error"))
        );
      });
    }
    Promise.all(promises).then((data) => setItemList(data));
  }, [items]);

  return (
    <Container>
      <SelectionContainer>
        <Label>Select Item Category:</Label>
        <Select
          name="items"
          defaultValue={true}
          onChange={(e) => setItemType(e.target.value)}
        >
          <option value={true} disabled>
            Select item type:
          </option>
          {itemCategories.map((category) => {
            return (
              <option value={category.value} key={category.name}>
                {category.name}
              </option>
            );
          })}
        </Select>
      </SelectionContainer>
      {items ? (
        itemList.map((item) => {
          return (
            <IndividualItem key={item.name}>
              <Name>
                <span>{capAndRemoveHyphen(item.name)}</span>
                <ImageContainer>
                  <img
                    alt={"Item sprite not available"}
                    src={item.sprites.default}
                  />
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
        <DefaultMessage>
          Select an item category to browse those items.
        </DefaultMessage>
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
  border: 0.1rem solid grey;
  border-radius: 5px;
`;

// Container for individual Item
const IndividualItem = styled.div`
  display: flex;
  border: 0.1rem solid grey;
  border-radius: 5px;
  margin: 0.5rem auto;
  width: 80%;
  text-align: center;
`;

// Name of the item (left side column)
const Name = styled.div`
  max-width: 20%;
  min-width: 20%;
  border-right: 0.1rem solid grey;
`;

// Image container to center the img of the item
const ImageContainer = styled.div`
  text-align: center;
`;

// Description of the item's effect in battle
const Description = styled.div`
  margin: auto;
  padding: 0.5rem;
`;

// Container for the default message before a category is selected
const DefaultMessage = styled.div`
  text-align: center;
  margin: 10rem auto;
`;
