const events = require("./events");
const Player = require("../classes/Player");
const Game = require("../classes/Game");

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
    socket.on(events.USER_CREATE_GAME, creator => {
      // Check if creator doesn't already create game
      const game = games.forEach(game => {
        if (game.creator._id === creator._id) return game;
      });
      if (game) return sendError("You already created a game");

      const newGame = new Game(creator);
      games.set(newGame._id, newGame);

      socket.emit(events.GAME_CREATED, newGame._id);

      broadcastLobbyInfos();
    });

    // User join game
    socket.on(events.USER_JOIN_GAME, ({ player, game_id }) => {
      socket.join(game_id);

      // Update Game
      const game = games.get(game_id);
      // If game is

      if (!game.player1) {
        game.player1 = player;
      } else {
        game.player2 = player;
      }
      game.playersNbr++;
      games.set(game_id, game);

      // Update Player
      player.game_id = game_id;
      players.set(player._id, player);

      broadcastLobbyInfos();
    });

    // User is ready
    socket.on(events.USER_READY, ({ player, game_id }) => {
      player.isReady = true;
      players.set(player._id, player);

      // Reassign player to game
      const game = games.get(game_id);
      if (game.player1._id === player._id) {
        game.player1 = player;
      }
      if (game.player2._id === player._id) {
        game.player2 = player;
      }

      // If players are ready  => Start game
      if (game.player1.isReady && game.player2.isReady) {
        socket.to(game_id).broadcast(events.GAME_START);
        game.gameInProgress = true;
      }
    });

    // User disconnect
    socket.on(events.USER_DISCONNECT, player => {
      // Delete player from players Map
      players.delete(player._id);
      // Remove player from game he was present
      const game = games.get(player.game_id);
      // If he was the creator , delete the game too
      if (game.creator._id === player._id) {
        games.delete(player.game_id);
      } else {
        if (game.player1._id === player._id) {
          game.player1 = null;
        }
        if (game.player2._id === player._id) {
          arguments.player2 = null;
        }
      }
      console.log(`${player.name} disconnect`);
      broadcastLobbyInfos();
    });

    //  UTILS FUNCTIONS //

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

  io.on(events.DISCONNECT, () => {});
};
