const express = require("express");

const {
  Registration,
  Signin,
  PokemonPartyAddition,
  GetProfile,
  UpdateBuild,
  DeleteBuild,
} = require("./handlers/pokemonHandlers");

express()
  .use(express.json())
  .use(express.static("public"))

  // Endpoint called in order to add a new user to the Users collection (Registration.js)
  .post("/createUser", Registration)

  // Endpoint called in order to sign into the website (Signin.js)
  .post("/signinUser", Signin)

  // Endpoint called in order to add a pokemon to a user's party (CreateBuildTable.js)
  .post("/pokemonPartyAddition", PokemonPartyAddition)

  // Endpoint called in order to get a certain profile (Profile.js)
  .get("/profile/:user", GetProfile)

  // Endpoint called in order to update a pokemon (Profile.js)
  .patch("/pokemon/update/", UpdateBuild)

  // Endpoint called in order to update a pokemon (Profile.js)
  .patch("/pokemon/delete/", DeleteBuild)

  .listen(4000, () => console.log("Listening on port 4000."));
