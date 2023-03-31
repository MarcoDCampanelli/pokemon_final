import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import GlobalStyle from "./GlobalStyles";

import Header from "./Components/Header";
import Homepage from "./Components/Homepage";
import Login from "./Components/LogInPage";
import SpecificPokemon from "./Components/SpecificPokemon";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <SiteContainer>
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/pokemon/:pokemon" element={<SpecificPokemon />} />
          </Routes>
        </SiteContainer>
      </BrowserRouter>
    </>
  );
};

export default App;

const SiteContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
