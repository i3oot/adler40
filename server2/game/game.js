
const GameState = Object.freeze({
  NEW: 'NEW',
  PLAYING: 'Playing',
  SCORING: 'Scoring'
});

const CardType = Object.freeze({
  NUMBER: 'number',
  ACTION: 'action',
  SPECIAL: 'special'
});

const CardColor = Object.freeze({
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
  YELLOW: 'yellow',
  BLACK: 'black'
});

class Card {

}

module.exports = {GameState, CardType, CardColor} ;
