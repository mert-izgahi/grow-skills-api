import express from "express";
import {
    getAllCourses,
    getOneCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} from "./controller.js";
import { withAuth } from "../../middlewares/with-auth-middleware.js";

const router = express.Router();

router.get("/courses", getAllCourses);
router.get("/courses/:id", getOneCourse);
router.post("/courses", withAuth, createCourse);
router.patch("/courses/:id", withAuth, updateCourse);
router.delete("/courses/:id", withAuth, deleteCourse);

export { router };
