// game.js
class Game {
    constructor(room, players = []) {
      this._id = room;
      this.players = players; // Load players if available, otherwise an empty array
    }
  
    addPlayer(username) {
      this.players.push(username);
      console.log(`${username} joined room ${this.room}`);
    }
  
    // Optionally other methods like starting the game, managing game state, etc.
  }
  
  module.exports = Game;
  