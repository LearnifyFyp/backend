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

router.route("/").post(isAuthenticatedUser, accessChat);
router.route("/").get(isAuthenticatedUser, fetchChats);
router.route("/group").post(isAuthenticatedUser, createGroupChat);
router.route("/rename").put(isAuthenticatedUser, renameGroup);
router.route("/groupremove").put(isAuthenticatedUser, removeFromGroup);
router.route("/groupadd").put(isAuthenticatedUser, addToGroup);

export default router;