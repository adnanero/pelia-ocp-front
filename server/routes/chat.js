const express = require("express");
const router = express.Router();
// const ChatController = require('./../controllers/ChatController');

router.post("/chat", (req, res) => {
  console.log("Server is up and running.")
    res.send({ response: "Server is up and running." }).status(200);
  });

module.exports = router;