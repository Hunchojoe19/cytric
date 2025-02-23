require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;
let dbInstance = null;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    dbInstance = client.db(process.env.DB_NAME);
    await dbInstance.collection('nfts').createIndex({ nftId: 1 }, { unique: true });
    console.log("Connected to MongoDB!");
    return dbInstance;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

function getDB() {
  if (!dbInstance) throw new Error('Database not initialized!');
  return dbInstance;
}

module.exports = { connectDB, getDB };