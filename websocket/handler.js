const events = require("./events");
const Player = require("../models/Player");
const Game = require("../models/Game");

module.exports = function (io) {
  // States
  let players = new Map();
  let games = new Map();

  // On connection
  io.on(events.CONNECTION, socket => {
    console.log("Connection");

    // User choose name
    socket.on(events.USER_CHOOSE_NAME, name => {
      const newPlayer = new Player(name);
      players.set(newPlayer._id, newPlayer);

      socket.emit(events.SEND_LOBBY_INFOS, {
        player: newPlayer,
        players: [...players.values()],
        games: [...games.values()]
      });

      broadcastLobbyInfos();

      console.log(`${name} as joined server`);
    });

    // User create game
    socket.on(events.CREATE_GAME, creator => {
      // Check if creator doesn't already create game
      const game = games.forEach(game => {
        if (game.creator._id === creator._id) return game;
      });
      if (game) return sendError("You already created a game");

      const newGame = new Game(creator);
      games.set(newGame._id, newGame);
      broadcastLobbyInfos();
    });

    // Update lobby infos to players
    function broadcastLobbyInfos() {
      socket.emit(events.SEND_LOBBY_INFOS, {
        players: [...players.values()],
        games: [...games.values()]
      });
      socket.broadcast.emit(events.SEND_LOBBY_INFOS, {
        players: [...players.values()],
        games: [...games.values()]
      });
    }

    function sendError(msg) {
      socket.emit(events.SEND_ERROR, msg);
    }
  });

  io.on(events.DISCONNECT, () => {
    console.log("Disconnected");
  });
};
