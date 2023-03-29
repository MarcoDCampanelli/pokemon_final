const express = require("express");
const app = express();

const { Signin } = require("./handlers/pokemonHandlers");

express()
  .use(express.json())
  .use(express.static("public"))

  .post("/createUser", Signin);

app.listen(3000, () => console.log("Server started on port 3000."));
