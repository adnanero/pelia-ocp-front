const express = require("express");
const router = express.Router();
// const ChatController = require('./../controllers/ChatController');

router.get("/chat", (req, res) => {
    res.send({ response: "Server is up and running." }).status(200);
  });

module.exports = router;