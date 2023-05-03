import express from "express";

import {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    deleteMyAccount,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser,
} from "../controllers/User.js";


import {
    isAuthenticatedUser,
    authorizeRolesForAdmin,
} from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/logout").get(logout);

router.route("/me/delete").delete(isAuthenticatedUser, deleteMyAccount);

router.route("/admin/users").get(isAuthenticatedUser, authorizeRolesForAdmin("admin"), getAllUsers);
router
    .route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRolesForAdmin("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRolesForAdmin("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRolesForAdmin("admin"), deleteUser);

export default router;