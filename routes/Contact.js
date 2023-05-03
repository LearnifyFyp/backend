import express from "express";

import {
    createContact,
    getAdminContacts,
    getAdminContact,
    adminDeleteContact,
} from "../controllers/Contact.js";

import { isAuthenticatedUser, authorizeRolesForAdmin } from "../middleware/auth.js";

const router = express.Router();

router.route("/contact/new").post(isAuthenticatedUser, createContact);

router.route("/admin/contacts").get(isAuthenticatedUser, authorizeRolesForAdmin("admin"), getAdminContacts);

router.route("/admin/contact/:id").get(isAuthenticatedUser, authorizeRolesForAdmin("admin"), getAdminContact)
    .delete(isAuthenticatedUser, authorizeRolesForAdmin("admin"), adminDeleteContact);

export default router;