// gameRepository.js
const { MongoClient, ServerApiVersion } = require('mongodb');
const Game = require('./game');

class GameRepository {
  constructor(mongoUrl) {
    this.client = new MongoClient(mongoUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    this.db = null; // Will be initialized during connection
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to MongoDB!");
      this.db = this.client.db('Adler40'); 
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  async loadGame(room) {
    const gameCollection = this.db.collection('games');
    // Look for an existing game with the room ID in the database
    const existingGame = await gameCollection.findOne({ _id: room });

    if (existingGame) {
      console.log(`Found existing game for room ${room}, loading state.`);
      return existingGame;
    } else {
      console.log(`No game found for room ${room}, creating a new one.`);
      const newGame = new Game(room); // Create new game instance
      await gameCollection.insertOne(newGame);
      console.log(`New game created and saved for room ${room}`);
      return newGame;
    }
  }

  async saveGame(room, gameState) {
    const gameCollection = this.db.collection('games');
    // Save or update the game state in the database
    await gameCollection.updateOne(
      { room }, // Filter by room ID
      { $set: gameState }, // Update the game state
      { upsert: true } // Create a new document if one does not exist
    );
    console.log(`Game state for room ${room} has been saved.`);
  }

  async close() {
    await this.client.close();
    console.log("MongoDB connection closed.");
  }
}

module.exports = GameRepository;
