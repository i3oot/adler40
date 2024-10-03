// gameRepository.js
const Game = require('./game');

class GameRepository {
  constructor(mongoService) {
    this.mongo = mongoService;
  }

  async loadGame(room) {
    const gameCollection = this.mongo.db().collection('games');
    const existingGame = await gameCollection.findOne({ _id: room });

    if (existingGame) {
      console.log(`Found existing game for room ${room}, loading state.`);
      return existingGame;
    } else {
      console.log(`No game found for room ${room}, creating a new one.`);
      const newGame = new Game(room); // Create new game instance
      return newGame;
    }
  }

  async saveGame(gameState) {
    const gameCollection = this.mongo.db().collection('games');
    // Save or update the game state in the database
    await gameCollection.updateOne(
      { _id: gameState._id }, 
      { $set: gameState }, 
      { upsert: true } 
    );
    console.log(`Game state for room ${gameState._id} has been saved.`);
  }

  async close() {
    await this.client.close();
    console.log("MongoDB connection closed.");
  }
}

module.exports = GameRepository;
