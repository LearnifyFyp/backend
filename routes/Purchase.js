import express from "express";

import {
    processPurchase,
    markDone,
} from "../controllers/Purchase.js";

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/process/purchase/lesson/:id").post(isAuthenticatedUser, processPurchase);

router.route("/tutor/purchase/lesson/markdone/:id").put(isAuthenticatedUser, authorizeRoles("tutor"), markDone);

export default router;