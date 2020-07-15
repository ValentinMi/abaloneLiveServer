const eventsName = require("./eventsName");
const Player = require("../models/Player");

module.exports = function (io) {
  // States
  let players = [];
  let games = [];

  // On connection
  io.on(eventsName.CONNECTION, socket => {
    console.log("Connection");

    // User choose name
    socket.on(eventsName.USER_CHOOSE_NAME, name => {
      const newPlayer = new Player(name);
      players.push(newPlayer);

      socket.emit(eventsName.SEND_LOBBY_INFOS, { players, games });

      // Send new lobby infos to players
      broadcastLobbyInfos(players, games, socket);

      console.log(`${name} as joined server`);
    });
  });

  io.on(eventsName.DISCONNECT, () => {
    console.log("Disconnected");
  });
};

function broadcastLobbyInfos(players, games, socket) {
  socket.broadcast.emit(eventsName.SEND_LOBBY_INFOS, { players, games });
}
