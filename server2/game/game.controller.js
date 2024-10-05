const _ = require('lodash');

class GameController {
  constructor(gameRepository, user, socket) {
    this._gameRepository = gameRepository;
    this._user = user;
    this._socket = socket;
  }

  _createNewGame() {
    const player = this._user;
    const room = this._socket.handshake.query.room;

      // Create the new game document
      const newGame = {
        lobby: [player], // Add the creating player to the lobby
        updatedAt: new Date(), // Timestamp of when the game is created
        gameState: _createNewGameState(),
        scoreboard: {}, // Empty scoreboard
      };
  }

  _createNewGameState() {
    return {
      state: GameState.NEW, // Initial game state
      availableDeck: _.shuffle(_deck()), // Empty available deck
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

  async join(){
    const room = this._socket.handshake.query.room;
    console.log(`${this._user.username} joins gameId ${room}`);
    let game = await this._gameRepository.loadGame(room);

    if (game) {
      console.log(`Found existing game for room ${room}, loading state.`);
    } else {
      console.log(`No game found for room ${room}, creating a new one.`);
      game = _createNewGame(room);
    }

    this._gameRepository.saveGame(game);
  }


}

module.exports = GameController;