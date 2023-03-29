import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import GlobalStyle from "./GlobalStyles";

import Header from "./Components/Header";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <SiteContainer>
          <Header />
          <Routes>
            <Route path="/" element={<>Hi there friend</>} />
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
