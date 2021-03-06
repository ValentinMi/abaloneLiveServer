const { v4: uuidv4 } = require("uuid");

module.exports = class Player {
  constructor(name) {
    this._id = `player_${uuidv4()}`;
    this.name = name;
    this.game_id = null;
    this.isPlaying = false;
    this.isReady = false;
  }
};
