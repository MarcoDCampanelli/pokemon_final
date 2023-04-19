import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import GlobalStyle from "./GlobalStyles";

import Header from "./Components/Header";
import Homepage from "./Components/Homepage";
import Login from "./Components/LogInPage";
import ResetPassword from "./Components/ResetPassword";
import SpecificPokemon from "./Components/SpecificPokemon";
import IndividualAttack from "./Components/IndividualAttack";
import Profile from "./Components/Profile";
import Natures from "./Components/Natures";
import Items from "./Components/Items";
import Abilities from "./Components/Abilities";
import Ability from "./Components/Ability";
import EggGroups from "./Components/EggGroups";
import EggGroup from "./Components/EggGroup";
import ErrorPage from "./Components/ErrorPage";
import ProfessorOak from "./Components/ProfessorOak";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <SiteContainer>
          <Header />
          <Body>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/signin" element={<Login />} />
              <Route path="/resetInformation" element={<ResetPassword />} />
              <Route path="/pokemon/:pokemon" element={<SpecificPokemon />} />
              <Route path="/attacks/:attack" element={<IndividualAttack />} />
              <Route path="/profile/:user" element={<Profile />} />
              <Route path="/natures" element={<Natures />} />
              <Route path="/items" element={<Items />} />
              <Route path="/abilities" element={<Abilities />} />
              <Route path="/abilities/:ability" element={<Ability />} />
              <Route path="/eggGroups" element={<EggGroups />} />
              <Route path="/eggGroups/:group" element={<EggGroup />} />
              <Route path="/helpMeProfessorOak" element={<ProfessorOak />} />
              <Route path="/error" element={<ErrorPage />} />
            </Routes>
          </Body>
          <Footer />
        </SiteContainer>
      </BrowserRouter>
    </>
  );
};

export default App;

// Container to hold the entire site
const SiteContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// This will ensure that the footer stays on the bottom during a loading state
const Body = styled.div`
  min-height: 85vh;
`;
