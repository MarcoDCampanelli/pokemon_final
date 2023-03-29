import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GlobalStyle from "./GlobalStyles";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<>Hi there friend</>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
