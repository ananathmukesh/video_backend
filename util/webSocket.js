// socket.js

const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "https://c-chat-frontend-mu.vercel.app",
//     methods: ["GET", "POST"],
//   },
// });


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


io.on('connection', (socket) => {
  console.log(`User Connected ${socket.id}`);
})



server.listen(8002, () => {
  console.log('Socket.IO server is running on port 8002');
});

module.exports = io;
