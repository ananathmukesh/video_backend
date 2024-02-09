const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const PORT = 5001
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("server is running");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("disconnect", () => socket.broadcast.emit("callEnded"));
  socket.on("callUser", ({ userToCall, signal, from, name }) => {
    io.to(userToCall).emit("callUser", { signal, from, name });
  });
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(PORT, () => {
  console.log(`web socket video call server is running on port ${PORT}`);
});

// Export the io object
module.exports = io;
