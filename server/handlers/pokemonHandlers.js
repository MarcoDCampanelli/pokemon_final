const { MongoClient } = require("mongodb");

require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const Signin = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  console.log(MONGO_URI);

  await client.connect();
  const db = client.db("Pokemon");

  const result = await db.collection("Users").insertOne({ user: "Marco" });

  client.close();
  return res.status(201).json({ status: 201, message: "User created." });
};

module.exports = { Signin };
