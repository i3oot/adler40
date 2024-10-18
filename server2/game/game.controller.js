const _ = require('lodash');
const {GameState} = require('./game')

class GameController {
  constructor(gameRepository, user, socket) {
    this._gameRepository = gameRepository;
    this._user = user;
    this._socket = socket;
  }

  _createNewGame() {
    const room = this._socket.handshake.query.room;

      // Create the new game document
      return {
        _id: room,
        scene: 'lobby',
        lobby: [], 
        updatedAt: new Date(), // Timestamp of when the game is created
        gameState: this._createNewGameState(),
        scoreboard: {}, // Empty scoreboard
      };


  }

  _createNewGameState() {
    return {
      state: GameState.NEW, // Initial game state
      availableDeck: _.shuffle(this._deck()), // Empty available deck
      playedDeck: [], // Empty played deck
      hands: {} // Empty hands for now
    };
  }

  _deck() {
    return [1,2,3,4,5,6,7,8]
  }

  dispatch(eventName, ...args) {
    if (typeof this[eventName] === 'function') {
      this[eventName](...args);
    } else {
        console.log(`no handler for event: ${eventName}`);
        socket.disconnect();
    }
  }


  async playCard(){
    const room = this._socket.handshake.query.room;
    let game = await this._gameRepository.loadGame(room);

    if (game) {
      console.log(`Found existing game for room ${room}, loading state.`);

      this._gameRepository.saveGame(game);
      this._socket.server.to(room).emit("game-state", game);    
    }
  }


  async join(){
    const room = this._socket.handshake.query.room;
    console.log(`${this._user.username} joins gameId ${room}`);
    let game = await this._gameRepository.loadGame(room);

    if (game) {
      console.log(`Found existing game for room ${room}, loading state.`);
    } else {
      console.log(`No game found for room ${room}, creating a new one.`);
      game = this._createNewGame(room);
    }
    if(!game.lobby.some(user => user.id === this._user.id)){
      game.lobby.push(this._user);
    }
    this._gameRepository.saveGame(game);
    this._socket.server.to(room).emit("game-state", game);    
  }

  async disconnect() {
    const room = this._socket.handshake.query.room;
    console.log(`${this._user.username} disconnects from gameId ${room}`);

    let game = await this._gameRepository.loadGame(room);
    if (game) {
      game.lobby = game.lobby.filter(user => user.id !== this._user.id);
      this._gameRepository.saveGame(game);
      this._socket.server.to(room).emit("game-state", game);    
    }
  }


}

module.exports = GameController;
