const { v4: uuidv4 } = require("uuid");

module.exports = class Game {
  constructor(creator) {
    this._id = `game_${uuidv4()}`;
    this.creator = creator;
    this.playersNbr = 0;
    this.player1 = null;
    this.player2 = null;

    this.gameInProgress = false;

    this.board = {};
    this.whoPlays = this.player1;
  }

  // startGame() {
  //   if (this.playersNbr === 2 && this.player1 && this.player2) {
  //     this.gameInProgress = true;
  //   }
  // }

  initGame() {
    const JSON_gameBoard = "";
  }
};
