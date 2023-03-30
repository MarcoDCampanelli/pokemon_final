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

module.exports = { Registration, Signin };
