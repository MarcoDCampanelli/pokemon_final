const express = require("express");

const { Registration, Signin } = require("./handlers/pokemonHandlers");

express()
  .use(express.json())
  .use(express.static("public"))

  // Endpoint called in order to add a new user to the Users collection (Registration.js)
  .post("/createUser", Registration)

  // Endpoint called in order to sign into the website (Signin.js)
  .post("/signinUser", Signin)

  .listen(4000, () => console.log("Listening on port 4000."));
