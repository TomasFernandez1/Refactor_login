import { Router } from "express";
import messagesManagerMongo from "../managers/messageManagerMongo.js";

import { io } from "../app.js";

const mManager = new messagesManagerMongo();
const router = Router();

// Endpoint chat
router.get("/chat", async (req, res) => {
  try {
    const messages = await mManager.getMessages();
    res.render("chat", { messages });
  } catch (error) {
    console.error(error);
    res.status(500).send({ Message: error.message });
  }
});

// Socket for "chat" endpoint
export function chatSocket() {
  io.on("connection", async (socket) => {
    socket.on("chat message", async (msg) => {
      console.log("Message received: ", msg);

      await mManager.createMessage(msg);

      io.emit("chat message", msg);
    });
  });
}

export default router;
