// gameRepository.js
const Game = require('./game');

class GameRepository {
  constructor(mongoService) {
    this.mongo = mongoService;
  }

  async loadGame(room) {
    const gameCollection = this.mongo.db.collection('games');
    const existingGame = await gameCollection.findOne({ _id: room });
    return existingGame;
  }

  async saveGame(gameState) {
    const gameCollection = this.mongo.db.collection('games');
    // Save or update the game state in the database
    await gameCollection.updateOne(
      { _id: gameState._id }, 
      { $set: gameState }, 
      { upsert: true } 
    );
    console.log(`Game state for room ${gameState._id} has been saved.`);
  }

}

module.exports = GameRepository;
