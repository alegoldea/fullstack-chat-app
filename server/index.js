const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/api/chat", (req, res) => {
  res.send("Chats");
});

app.get("/api/chat/:id", (req, res) => {
  //console.log(req.params.id);
  const singleChat = chats.find((c) => c.id === req.params.id);
  res.send(singleChat);
});

const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`Server started on port ${PORT}... `));
