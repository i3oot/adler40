// Import statements (consistent ES6 syntax)
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

// Load and expand environment variables
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

// Retrieve the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

// Check if the URI is set
if (!uri) {
  console.error('Error: MONGODB_URI is not defined in your environment variables.');
  process.exit(1); // Correctly exit the process with an error code
}

console.log('Connecting to MongoDB with URI:', uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch((err) => {
  console.error('An unexpected error occurred:', err);
});
