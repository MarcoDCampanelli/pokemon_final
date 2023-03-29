const express = require("express");

const { Signin } = require("./handlers/pokemonHandlers");

express()
  .use(express.json())
  .use(express.static("public"))

  .post("/createUser", Signin)

  .listen(3000, () => console.log("Listening on port 3000"));
