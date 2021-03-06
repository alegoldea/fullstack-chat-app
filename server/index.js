const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL || "");

const app = express();
connectDB();

const server = require("http").createServer(app);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API running");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const ORIGIN_URL = process.env.FRONTEND_URL || "http://localhost:3000";

server.listen(5000, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ORIGIN_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.userId = userData._id;
    socket.join(userData._id);
    redisClient.set(`status:${userData._id}`, true);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected " + socket.userId); // retrieve it from socket object
    redisClient.del(`status:${socket.userId}`);
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
