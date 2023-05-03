import express from "express";

import {
    createLesson,
    getMyLesson,
    getAllLesson,
    getLessonDetails,
    getAdminLesson,
    adminDeleteLesson,
    adminGetAllSoldLesson,
    updateLesson,
    deleteLesson,
    createLessonReview,
    getLessonReviews,
    deleteLessonReview,
    myPurchaseLessons,
    mySellLessons,
} from "../controllers/Lesson.js";


import { isAuthenticatedUser, authorizeRoles, authorizeRolesForAdmin } from "../middleware/auth.js";


const router = express.Router();

router.route("/tutor/lesson").post(isAuthenticatedUser, authorizeRoles("tutor"), createLesson);

router.route("/tutor/my/lesson").get(isAuthenticatedUser, authorizeRoles("tutor"), getMyLesson);

router
    .route("/tutor/lesson/:id")
    .put(isAuthenticatedUser, authorizeRoles("tutor"), updateLesson)
    .delete(isAuthenticatedUser, authorizeRoles("tutor"), deleteLesson);

router.route("/lessons").get(getAllLesson);

router.route("/lesson/:id").get(getLessonDetails);

router.route("/tutor/my/sell/lessons").get(isAuthenticatedUser, authorizeRoles("tutor"), mySellLessons);

router.route("/student/my/purchase/lessons").get(isAuthenticatedUser, myPurchaseLessons);

router
    .route("/admin/lessons")
    .get(isAuthenticatedUser, authorizeRolesForAdmin("admin"), getAdminLesson);

router
    .route("/admin/sold/lessons")
    .get(isAuthenticatedUser, authorizeRolesForAdmin("admin"), adminGetAllSoldLesson);

router
    .route("/admin/lesson/:id")
    .delete(isAuthenticatedUser, authorizeRolesForAdmin("admin"), adminDeleteLesson);

router.route("/review").put(isAuthenticatedUser, createLessonReview);

router.route("/reviews")
    .get(getLessonReviews)
    .delete(deleteLessonReview);


export default router;