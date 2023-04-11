const { MongoClient } = require("mongodb");
// Package to generate random id strings
const { v4: uuidv4 } = require("uuid");
// Package to hash passwords
const bcrypt = require("bcrypt");

require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Handler to add a new user to the Users collection
const Registration = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { user, password, email } = req.body;

  // The following are validation checks when creating an account
  // 1. The user needs to have an actual username with a minimum of 1 character
  if (user === "") {
    return res
      .status(406)
      .json({ status: 406, message: "Please enter a valid username." });
  }

  // 2. The email must contain an @ symbol
  if (!email.includes("@")) {
    return res
      .status(406)
      .json({ status: 406, message: "Please enter a valid email address." });
  }

  // The password can't be empty, must contain at least 1 number, and must be at least 8 characters long
  if (password === "" || !/\d/.test(password) || password.length < 8) {
    return res.status(406).json({
      status: 406,
      message:
        "Your password must include a number and be at least 8 characters long.",
    });
  }

  await client.connect();
  const db = client.db("Pokemon");

  // First, check to see if the user already exists
  const result = await db
    .collection("Users")
    .findOne({ user: user, email: email });

  // If the name/email is already taken, return the following
  if (result) {
    return res.status(406).json({
      status: 406,
      data: { user, email },
      message: "Sorry, a user with that name and email already exist.",
    });
  }

  // If the name is available, create the user
  // 1. Create a id string
  const _id = uuidv4();
  // 2. Hash the password
  const hash = await bcrypt.hash(password, 10);
  // 3. Create the user with the aforementioned details
  const createUser = await db
    .collection("Users")
    .insertOne({ _id, user: user, email: email, hash: hash });

  client.close();

  if (createUser.acknowledged) {
    return res
      .status(201)
      .json({ status: 201, data: user, message: "User successfully created." });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Something went wrong, please try again.",
    });
  }
};

// Handler to sign in the user
const Signin = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { user, email, password } = req.body;

  await client.connect();
  const db = client.db("Pokemon");

  // First, check to see if the user exists
  const result = await db
    .collection("Users")
    .findOne({ user: user, email: email });

  // If yes, then the user's password needs to be checked
  if (result) {
    const validPassword = await bcrypt.compare(password, result.hash);

    // If the passwords are the same, the following is returned.
    if (validPassword) {
      return res.status(200).json({
        status: 200,
        data: user,
        message: "Log in successful.",
      });
    } else {
      return res
        .status(404)
        .json({ status: 404, message: "Incorrect password." });
    }
  }

  client.close();

  return res.status(404).json({
    status: 404,
    message: "Sorry, a user with that name and password does not exist.",
  });
};

// Handler to add a Pokemon to the person's party
const PokemonPartyAddition = async (req, res) => {
  const {
    trainer,
    name,
    id,
    generation,
    ability,
    nature,
    level,
    item,
    iv,
    ev,
    stats,
    attacks,
  } = req.body;

  const client = new MongoClient(MONGO_URI, options);

  // Several checks must take place first to see if the entered informations is valid.
  // 1. IV, EV and attacks need to be defined and can't be empty
  if (!iv || !ev || !attacks) {
    return res
      .status(404)
      .json({ status: 400, message: "Information is missing." });
  }

  if (!ability) {
    return res
      .status(404)
      .json({ status: 404, message: "Please select an ability." });
  }
  if (!nature) {
    return res
      .status(404)
      .json({ status: 404, message: "Please select a nature." });
  }

  // This will check to see if all stat values are numbers
  let statCheck = stats.every((stat) => typeof stat === "number");
  if (!statCheck) {
    return res.status(404).json({
      status: 404,
      message:
        "The Pokemon's final stat value is not a number, please check again.",
    });
  }

  // This will check to see if all iv are numbers and don't exceed 31
  let ivCheck = Object.values(iv).every(
    (number) => number <= 31 && typeof number === "number"
  );
  if (!ivCheck) {
    return res.status(404).json({
      status: 404,
      message: "Any individual IV cannot exceed a value of 31.",
    });
  }

  // This will check to see if all ev are below 252 and don't add up to 510
  let evCheck =
    Object.values(ev).every((number) => number <= 252) &&
    Object.values(ev).reduce((a, b) => a + b, 0) <= 510;
  if (!evCheck) {
    return res.status(404).json({
      status: 404,
      message:
        "You cannot exceed a total EV count of 510. Any individual stat cannot exceed a total of 252.",
    });
  }

  // This will ensure that attacks aren't repeated and are all unique
  let attackArray = Array.from(new Set(Object.values(attacks)));
  let attackCheck =
    attackArray.length === 4 && attackArray.every((attack) => attack !== "");

  if (!attackCheck) {
    return res.status(404).json({
      status: 404,
      message:
        "You are required to select 4 unique move slots for this Pokemon.",
    });
  }

  // First, check to see if the person already has an active party
  await client.connect();
  const db = client.db("Pokemon");
  const profile = await db
    .collection("PokemonParties")
    .findOne({ trainer: trainer });

  // If they do not, then create one
  if (!profile) {
    try {
      const _id = uuidv4();
      const pokemonId = uuidv4();

      const result = await db.collection("PokemonParties").insertOne({
        _id,
        trainer: trainer,
        party: [
          {
            pokemon: name,
            entryId: pokemonId,
            index: id,
            generation: generation,
            ability: ability,
            nature: nature,
            level: level,
            item: item,
            iv: iv,
            ev: ev,
            stats: stats,
            attacks: attacks,
          },
        ],
      });
      return res.status(201).json({
        status: 201,
        data: result,
        message: "Pokemon successfully added to party.",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, message: "An error occured, please try again" });
    }
  }

  // If they already have an active party, just add the pokemon to their existing party
  if (profile) {
    try {
      const pokemonId = uuidv4();
      const result = await db.collection("PokemonParties").updateOne(
        { trainer: trainer },
        {
          $push: {
            party: {
              pokemon: name,
              entryId: pokemonId,
              index: id,
              generation: generation,
              ability: ability,
              nature: nature,
              level: level,
              item: item,
              iv: iv,
              ev: ev,
              stats: stats,
              attacks: attacks,
            },
          },
        }
      );
      return res.status(201).json({
        status: 201,
        data: result,
        message: "Pokemon successfully added to party.",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, message: "An error occured, please try again" });
    }
  }

  client.close();
};

const GetProfile = async (req, res) => {
  const user = req.params.user;

  const client = new MongoClient(MONGO_URI, options);

  await client.connect();
  const db = client.db("Pokemon");

  const result = await db
    .collection("PokemonParties")
    .findOne({ trainer: user });

  if (result) {
    return res.status(200).json({ status: 200, success: true, data: result });
  }

  client.close();

  return res.status(404).json({
    status: 404,
    success: false,
    data: user,
    message: "Trainer cannot be found",
  });
};

const UpdateBuild = async (req, res) => {
  const { trainer, ability, nature, iv, ev, stats, attacks, pokemonId } =
    req.body;

  const client = new MongoClient(MONGO_URI, options);

  // Several checks must take place first to see if the entered informations is valid.
  // 1. IV, EV and attacks need to be defined and can't be empty
  if (!iv || !ev || !attacks) {
    return res
      .status(404)
      .json({ status: 400, message: "Information is missing." });
  }

  if (!ability) {
    return res
      .status(404)
      .json({ status: 404, message: "Please select an ability." });
  }
  if (!nature) {
    return res
      .status(404)
      .json({ status: 404, message: "Please select a nature." });
  }

  // This will check to see if all stat values are numbers
  let statCheck = stats.every((stat) => typeof stat === "number");
  if (!statCheck) {
    return res.status(404).json({
      status: 404,
      message:
        "The Pokemon's final stat value is not a number, please check again.",
    });
  }
  // This will check to see if all iv are numbers and don't exceed 31
  let ivCheck = Object.values(iv).every(
    (number) => number <= 31 && typeof number === "number"
  );
  if (!ivCheck) {
    return res.status(404).json({
      status: 404,
      message: "Any individual IV cannot exceed a value of 31.",
    });
  }

  // This will check to see if all ev are below 252 and don't add up to 510
  let evCheck =
    Object.values(ev).every((number) => number <= 252) &&
    Object.values(ev).reduce((a, b) => a + b, 0) <= 510;
  if (!evCheck) {
    return res.status(404).json({
      status: 404,
      message:
        "You cannot exceed a total EV count of 510. Any individual stat cannot exceed a total of 252.",
    });
  }

  // This will ensure that attacks aren't repeated and are all unique
  let attackArray = Array.from(new Set(Object.values(attacks)));
  let attackCheck =
    attackArray.length === 4 && attackArray.every((attack) => attack !== "");

  if (!attackCheck) {
    return res.status(404).json({
      status: 404,
      message:
        "You are required to select 4 unique move slots for this Pokemon.",
    });
  }

  await client.connect();
  const db = client.db("Pokemon");

  const pokemon = await db
    .collection("PokemonParties")
    .findOne({ trainer: trainer, "party.entryId": pokemonId });

  if (!pokemon) {
    return res.status(404).json({
      status: 404,
      data: req.body,
      message: "No pokemon with that information exists in this party.",
    });
  }

  if (pokemon) {
    try {
      const pokemonUpdate = await db.collection("PokemonParties").updateOne(
        { trainer: trainer, "party.entryId": pokemonId },
        {
          $set: {
            "party.$.ability": ability,
            "party.$.nature": nature,
            "party.$.iv": iv,
            "party.$.ev": ev,
            "party.$.stats": stats,
            "party.$.attacks": attacks,
          },
        }
      );

      if (pokemonUpdate.modifiedCount > 0) {
        return res
          .status(201)
          .json({ status: 201, message: "Pokemon successfully updated." });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, message: "An error occured, please try again" });
    }
  }

  client.close();
};

const DeleteBuild = async (req, res) => {
  const { trainer, pokemonId } = req.body;

  const client = new MongoClient(MONGO_URI, options);

  await client.connect();
  const db = client.db("Pokemon");

  const pokemon = await db
    .collection("PokemonParties")
    .findOne({ trainer: trainer, "party.entryId": pokemonId });

  if (!pokemon) {
    return res.status(404).json({
      status: 404,
      data: req.body,
      message: "No pokemon with that information exists in this party.",
    });
  }

  if (pokemon) {
    try {
      const pokemonDelete = await db.collection("PokemonParties").updateOne(
        {
          trainer: trainer,
          "party.entryId": pokemonId,
        },
        { $pull: { party: { entryId: pokemonId } } }
      );

      if (pokemonDelete.modifiedCount > 0) {
        return res
          .status(201)
          .json({ status: 201, message: "Pokemon was released successfully." });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, message: "An error occured, please try again" });
    }
  }

  client.close();
};

const PostBuild = async (req, res) => {
  const {
    trainer,
    name,
    id,
    generation,
    ability,
    nature,
    level,
    item,
    iv,
    ev,
    stats,
    attacks,
    description,
  } = req.body;

  console.log(req.body);

  const client = new MongoClient(MONGO_URI, options);

  // Several checks must take place first to see if the entered informations is valid.
  // 1. IV, EV and attacks need to be defined and can't be empty
  if (!iv || !ev || !attacks) {
    return res
      .status(404)
      .json({ status: 400, message: "Information is missing." });
  }

  if (!ability) {
    return res
      .status(404)
      .json({ status: 404, message: "Please select an ability." });
  }
  if (!nature) {
    return res
      .status(404)
      .json({ status: 404, message: "Please select a nature." });
  }

  // This will check to see if all stat values are numbers
  let statCheck = stats.every((stat) => typeof stat === "number");
  if (!statCheck) {
    return res.status(404).json({
      status: 404,
      message:
        "The Pokemon's final stat value is not a number, please check again.",
    });
  }
  // This will check to see if all iv are numbers and don't exceed 31
  let ivCheck = Object.values(iv).every(
    (number) => number <= 31 && typeof number === "number"
  );
  if (!ivCheck) {
    return res.status(404).json({
      status: 404,
      message: "Any individual IV cannot exceed a value of 31.",
    });
  }

  // This will check to see if all ev are below 252 and don't add up to 510
  let evCheck =
    Object.values(ev).every((number) => number <= 252) &&
    Object.values(ev).reduce((a, b) => a + b, 0) <= 510;
  if (!evCheck) {
    return res.status(404).json({
      status: 404,
      message:
        "You cannot exceed a total EV count of 510. Any individual stat cannot exceed a total of 252.",
    });
  }

  // This will ensure that attacks aren't repeated and are all unique
  let attackArray = Array.from(new Set(Object.values(attacks)));
  let attackCheck =
    attackArray.length === 4 && attackArray.every((attack) => attack !== "");

  if (!attackCheck) {
    return res.status(404).json({
      status: 404,
      message:
        "You are required to select 4 unique move slots for this Pokemon.",
    });
  }

  await client.connect();
  const db = client.db("Pokemon");
  const _id = uuidv4();

  try {
    const build = await db.collection("CompetitiveBuilds").insertOne({
      _id,
      trainer: trainer,
      pokemon: name,
      index: id,
      generation: generation,
      ability: ability,
      nature: nature,
      level: level,
      item: item,
      iv: iv,
      ev: ev,
      stats: stats,
      attacks: attacks,
      description: description,
      comments: [],
    });

    client.close();

    return res
      .status(201)
      .json({ status: 201, message: "Build successfully submitted." });
  } catch (err) {
    client.close();

    return res.status(409).json({
      status: 409,
      data: req.body,
      message: "Something went wrong, please try again",
    });
  }
};

const GetBuilds = async (req, res) => {
  const { pokemon } = req.params;

  const client = new MongoClient(MONGO_URI, options);

  await client.connect();
  const db = client.db("Pokemon");

  const builds = await db
    .collection("CompetitiveBuilds")
    .find({ pokemon: { $regex: pokemon } })
    .toArray();

  if (builds.length === 0) {
    return res.status(404).json({
      status: 404,
      message: "No build of that pokemon exist at the moment.",
    });
  }

  client.close();

  return res.status(200).json({ status: 200, data: builds });
};

module.exports = {
  Registration,
  Signin,
  PokemonPartyAddition,
  GetProfile,
  UpdateBuild,
  DeleteBuild,
  PostBuild,
  GetBuilds,
};
