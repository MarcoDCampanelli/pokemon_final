import { useState } from "react";
import { Link } from "react-router-dom";

import OakLab from "../assets/oak'slab.jpg";
import Oak from "../assets/professor oak.png";

import styled, { keyframes } from "styled-components";

const ProfessorOak = () => {
  const [question, setQuestion] = useState("");

  console.log(question);

  return (
    <Demo>
      <Background src={OakLab}></Background>
      <Container>
        <Paragraph>
          Hello there! Welcome to the world of Pokemon! My name is Oak!
        </Paragraph>
        <Paragraph2>
          People call me the Pokemon professor. How can I help you today?
        </Paragraph2>
      </Container>
      <FlexContainer>
        <ProfessorContainer>
          <Professor src={Oak}></Professor>
        </ProfessorContainer>
        <InformationContainer>
          <QuestionSelect>
            <Label>Question about: </Label>
            <Select
              name="questions"
              defaultValue={true}
              onChange={(e) => setQuestion(e.target.value)}
            >
              <option value={true} disabled>
                Select a topic:
              </option>
              <option value={"iv"}>IVs</option>
              <option value={"ev"}>EVs</option>
              <option value={"natures"}>Natures</option>
              <option value={"items"}>Items</option>
              <option value={"abilities"}>Abilities</option>
              <option value={"eggGroups"}>Egg Groups</option>
            </Select>
          </QuestionSelect>
          <Description>
            {question === "iv" && (
              <Test>
                All pokemon have 6 main stats. These stats are: Health, Attack,
                Special Attack, Defense, Special Defense and Speed. Individual
                values, or IV's, are a randomnly generated number between 0 and
                31. Outside of certain rare items, a Pokemon's IV's cannot be
                changed.
              </Test>
            )}
            {question === "ev" && (
              <Test>
                A Pokemon also has Effort Values, or EV's, for each individual
                stat. Every time a Pokemon defeats another Pokemon in battle, it
                will gain some EV's in a certain stat. For example, defeating a
                Pikachu in battle will grant your Pokemon 2 EV's in speed. A
                Pokemon is able to gain a total of 252 EV's in any 1 stat before
                it will no longer gain anymore. Furthermore, a Pokemon cannot
                gain more than 510 EV's across all stats.
              </Test>
            )}
            {question === "natures" && (
              <Test>
                A Pokemon can randomnly have 1 of 25 natures. Some natures will
                not affect a Pokemon at all, while others will increase one of
                their stats by 10% while decreasing a different stat by 10%. You
                can change your Pokemon's nature by using certain mints. For
                more information, please consult the{" "}
                <StyledLink to={"/natures"}>Nature</StyledLink> chart.
              </Test>
            )}
            {question === "items" && (
              <Test>
                Pokemon are able to hold items in battle. Certain items can only
                be used once, after which they are gone forever. Other items can
                be held onto forever and provide permanent effects for your
                Pokemon during battle. For futher information, please consult
                the <StyledLink to={"/items"}>Item</StyledLink> catalogue and
                select an item category.
              </Test>
            )}
            {question === "abilities" && (
              <Test>
                Most Pokemon have 1-2 regular abilities and 1 hidden ability.
                Abilities can be passed down to an offspring. If a Pokemon
                naturally has 2 regular abilities, they have a 80% chance to
                inherit the ability of their mother. If the mother has access to
                their species' hidden ability, there is a 60% chance that the
                offspring will have this ability as well. To know the effects of
                certain abilities please consult the{" "}
                <StyledLink to={"/abilities"}>Abilities</StyledLink> list.
              </Test>
            )}
            {question === "eggGroups" && (
              <Test>
                Most Pokemon are part of either 1 or 2 egg groups. Noticeable
                exceptions are legendary Pokemon and a few others. The
                offspring's species will be the same as the mother's. If one of
                the parents know an egg move that the offspring can learn, it
                will hatch with that specific attack. To find a list of egg
                groups and the pokemon who belong to them, please visit our{" "}
                <StyledLink to={"/eggGroups"}>Egg Group</StyledLink> list.
              </Test>
            )}
          </Description>
        </InformationContainer>
      </FlexContainer>
    </Demo>
  );
};

export default ProfessorOak;

const Test = styled.p`
  line-height: 5vh;

  @media (max-width: 768px) {
    line-height: 3vh;
  }
`;

// This container allows the images to overlap
const Demo = styled.div`
  position: relative;
  height: 85vh;
  background-image: url(OakLab);
`;

// !Below are the fading animations
// This is the animation being used for the background
const FadeOut = keyframes`
  0% {
    opacity: 1
  }
  100% {
    opacity: 0.4
  }
`;

// This is the animation being used for Professor Oak
const FadeIn = keyframes`
  0% {
    opacity: 0
  }
  100% {
    opacity: 1
  }
`;

// Background image of the lab
const Background = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  animation-name: ${FadeOut};
  animation-fill-mode: forwards;
  animation-duration: 4s;
  animation-iteration-count: 1;
`;

// Not a real container, just width is being used here
const ProfessorContainer = styled.div`
  width: 30%;
`;

// Image of the professor
const Professor = styled.img`
  position: absolute;
  bottom: 0;
  margin-left: 10rem;
  height: 60%;
  animation-name: ${FadeIn};
  animation-duration: 4s;
  animation-iteration-count: 1;

  @media (max-width: 912px) {
    margin-left: 5rem;
    height: 50%;
  }

  @media (max-width: 570px) {
    margin-left: 1rem;
    height: 30%;
  }
`;

// !Below is the typing animations
// This is the animation being used to show typing text
const Typing = keyframes`
  0% {
    width: 0%;
  }
  50% {
    width: 0%
  }
  100% {
    width: 100%
  }
`;

// This is the animation being used to show typing text that moves a little faster to compensate for the use of 2 lines
const TypingFaster = keyframes`
  0% {
    width: 0%;
  }
  75% {
    width: 0%
  }
  100% {
    width: 100%
  }
`;

// This is the animation being used to show a blinking cursor
const Blinking = keyframes`
0% {
  border-color: transparent;
}
50% {
  border-color: black;
}
100% {
  border-color: transparent
}
`;

// This container is holding the paragraph and it's animations. Display: inline-block is needed
const Container = styled.div`
  display: inline-block;
  text-align: center;
`;

// This paragraph holds what is being typed
const Paragraph = styled.p`
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  margin: 0.5rem;
  font-weight: bold;
  font-size: 1.1rem;
  border-right: 0.05rem solid;
  animation: ${Typing} 8s steps(62, end) forwards, ${Blinking} 1s infinite;
`;

// This styling is needed to make the text appear at similar speeds
const Paragraph2 = styled(Paragraph)`
  animation: ${TypingFaster} 12s steps(62, end) forwards,
    ${Blinking} 1s infinite;
`;

// Container holding the two divs that contain the professor and the select options respectively
const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

//Container that holds the label, select options and the description
const InformationContainer = styled.div`
  width: 60%;
`;

// Container for the label and select options
const QuestionSelect = styled.div`
  display: flex;
  margin: 1rem;
  justify-content: center;
  align-items: center;
`;

// Styling for the labels
const Label = styled.label`
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0 0.5rem;
`;

// Styling for the labels
const Select = styled.select`
  padding: 0.5rem;
  border: 0.1rem solid grey;
  border-radius: 5px;
`;

//Styling for the answer to the selected questions
const Description = styled.div`
  width: 60%;
  margin: 1rem auto;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
`;

// Link to the suggested pages
const StyledLink = styled(Link)`
  color: black;
  text-decoration: underline;
`;
