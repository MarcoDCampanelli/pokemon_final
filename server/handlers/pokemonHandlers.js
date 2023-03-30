const { MongoClient } = require("mongodb");
// Package to generate random id strings
const { v4: uuidv4 } = require("uuid");

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
  const _id = uuidv4();
  const createUser = await db
    .collection("Users")
    .insertOne({ _id, ...req.body });

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
  const { user, password } = req.body;

  await client.connect();
  const db = client.db("Pokemon");

  // First, check to see if the user exists
  const result = await db
    .collection("Users")
    .findOne({ user: user, password: password });

  // If yes, then the user's name will be returned to the front end
  if (result) {
    return res.status(200).json({
      status: 200,
      data: user,
      message: "Log in successful.",
    });
  }

  client.close();

  return res
    .status(404)
    .json({
      status: 404,
      message: "Sorry, a user with that name and password does not exist.",
    });
};

module.exports = { Registration, Signin };
