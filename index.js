require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT;

require("./websocket/handler")(io);

server.listen(PORT, console.log(`Web Socket listening on port ${PORT}...`));
