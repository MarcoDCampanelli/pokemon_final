import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GlobalStyle from "./GlobalStyles";

import Header from "./Components/Header";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<>Hi there friend</>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
