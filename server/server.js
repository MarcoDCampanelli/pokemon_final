const express = require("express");

const {
  Registration,
  Signin,
  PokemonPartyAddition,
  GetProfile,
  UpdateBuild,
} = require("./handlers/pokemonHandlers");

express()
  .use(express.json())
  .use(express.static("public"))

  // Endpoint called in order to add a new user to the Users collection (Registration.js)
  .post("/createUser", Registration)

  // Endpoint called in order to sign into the website (Signin.js)
  .post("/signinUser", Signin)

  // Endpoint called in order to sign into the website (CreateBuildTable.js)
  .post("/pokemonPartyAddition", PokemonPartyAddition)

  // Endpoint called in order to sign into the website (Profile.js)
  .get("/profile/:user", GetProfile)

  // Endpoint called in order to sign into the website (Profile.js)
  .patch("/pokemon/update/", UpdateBuild)

  .listen(4000, () => console.log("Listening on port 4000."));
