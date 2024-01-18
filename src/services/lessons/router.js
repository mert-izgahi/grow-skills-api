import express from "express";
import {
    getAllLessons,
    getOneLesson,
    createLesson,
    updateLesson,
    deleteLesson,
} from "./controller.js";
import { withAuth } from "../../middlewares/with-auth-middleware.js";

const router = express.Router();

router.get("/lessons", withAuth, getAllLessons);
router.get("/lessons/:id", withAuth, getOneLesson);
router.post("/lessons", withAuth, createLesson);
router.patch("/lessons/:id", withAuth, updateLesson);
router.delete("/lessons/:id", withAuth, deleteLesson);

export { router };
