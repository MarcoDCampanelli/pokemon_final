import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { UserProvider } from "./Components/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);