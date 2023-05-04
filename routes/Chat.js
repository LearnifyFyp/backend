import express from "express";

import {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} from "../controllers/Chat.js";

import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/chat").post(isAuthenticatedUser, accessChat);
router.route("/chat").get(isAuthenticatedUser, fetchChats);
router.route("/chat/group").post(isAuthenticatedUser, createGroupChat);
router.route("/chat/rename").put(isAuthenticatedUser, renameGroup);
router.route("/chat/groupremove").put(isAuthenticatedUser, removeFromGroup);
router.route("/chat/groupadd").put(isAuthenticatedUser, addToGroup);

export default router;