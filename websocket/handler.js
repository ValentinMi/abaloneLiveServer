const eventsName = require("./eventsName");

module.exports = function (io) {
  // On connection
  io.on(eventsName.CONNECTION, socket => {
    console.log("Connection");

    socket.on(eventsName.USER_CHOOSE_NAME, name => {
      console.log(name);
      console.log(`${name} as joined server`);
    });
  });
};
