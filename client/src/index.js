import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { UserProvider } from "./Components/UserContext";

// !Removing to see if something gets fixed
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("service-worker.js")
//     .then((registration) => {
//       console.log("SW Registered!");
//       console.log(registration);
//     })
//     .catch((error) => {
//       console.log("SW Registration failed");
//       console.log(error);
//     });
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
