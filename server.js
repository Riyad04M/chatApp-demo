const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { Socket } = require("dgram");
const { formatMessage } = require("./utlis/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utlis/user");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static server
app.use(express.static(path.join(__dirname, "public")));

//Run when a client connects

io.on("connection", (socket) => {
  console.log("New WS Connection...");

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // welcoming a user
    socket.emit("message", formatMessage("bot albert", "Hello World"));
    // broadcast when user joins the chat
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("bot albert", `${user.username} has join the chat`)
      );

    // sending room info to client
    io.to(user.room).emit("roomInfo", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // listen for chatMessage (from client)
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //   when a client disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("bot albert", `${user.username} has left the chat`)
      );

      // sending room info to client
      io.to(user.room).emit("roomInfo", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
