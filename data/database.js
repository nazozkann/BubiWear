const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  console.log("··· connectToDatabase başlad");
  const client = await MongoClient.connect("mongodb://localhost:27017");
  console.log("··· MongoClient.connect tamam");
  database = client.db("online-shop");
}

async function connectToDatabase() {
  const client = await MongoClient.connect("mongodb://localhost:27017");
  database = client.db("online-shop");
}

function getDb() {
  if (!database) {
    throw new Error("You must connect first to database!");
  }
  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
