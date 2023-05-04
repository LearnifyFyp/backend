import express from "express";

import {
  allMessages,
  sendMessage,
} from "../controllers/Message.js";

import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/chat").post(isAuthenticatedUser, sendMessage);
router.route("/chat/:chatId").get(isAuthenticatedUser, allMessages);

export default router;