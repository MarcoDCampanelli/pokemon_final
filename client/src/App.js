import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import GlobalStyle from "./GlobalStyles";

import Header from "./Components/Header";
import Homepage from "./Components/Homepage";
import Login from "./Components/LogInPage";
import SpecificPokemon from "./Components/SpecificPokemon";
import IndividualAttack from "./Components/IndividualAttack";
import Natures from "./Components/Natures";
import Items from "./Components/Items";
import ErrorPage from "./Components/ErrorPage";
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
              <Route path="/pokemon/:pokemon" element={<SpecificPokemon />} />
              <Route path="/attacks/:attack" element={<IndividualAttack />} />
              <Route path="/natures" element={<Natures />} />
              <Route path="/items" element={<Items />} />
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
  min-height: 100vh;
`;
