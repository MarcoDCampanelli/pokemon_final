const express = require("express");

const {
  Registration,
  Signin,
  ResetPassword,
  PokemonPartyAddition,
  GetProfile,
  UpdateBuild,
  DeleteBuild,
  PostBuild,
  GetBuilds,
  PostComment,
  DeleteComment,
  DeletePostedBuild,
} = require("./handlers/pokemonHandlers");

express()
  .use(express.json())
  .use(express.static("public"))

  // Endpoint called in order to add a new user to the Users collection (Registration.js)
  .post("/createUser", Registration)

  // Endpoint called in order to sign into the website (Signin.js)
  .post("/signinUser", Signin)

  // Endpoint called in order to sign into the website (ResetPassword.js)
  .patch("/resetPassword", ResetPassword)

  // Endpoint called in order to add a pokemon to a user's party (CreateBuildTable.js and Builds.js)
  .post("/pokemonPartyAddition", PokemonPartyAddition)

  // Endpoint called in order to get a certain profile (Profile.js)
  .get("/profile/:user", GetProfile)

  // Endpoint called in order to update a pokemon (Profile.js)
  .patch("/pokemon/update/", UpdateBuild)

  // Endpoint called in order to delete a pokemon from a user's party. Since the party still exists, a patch is used.(Profile.js)
  .patch("/pokemon/delete/", DeleteBuild)

  // Endpoint called in order to post a certain pokemon build (Profile.js)
  .post("/pokemon/postBuild/", PostBuild)

  // Endpoint called in order to get a list of all existing builds of this specific pokemon (SpecificPokemon.js)
  .get("/pokemon/getBuilds/:pokemon", GetBuilds)

  // Endpoint called in order to add a comment to a specific pokemon's build (Builds.js)
  .patch("/pokemon/leaveComment", PostComment)

  //Endpoint called in order to delete a comment left by a user on a certain build (Builds.js)
  .patch("/deleteComment/:comment", DeleteComment)

  // Endpoint called in order to delete a certain build (Builds.js)
  .delete("/pokemon/delete/:build", DeletePostedBuild)

  .listen(4000, () => console.log("Listening on port 4000."));
