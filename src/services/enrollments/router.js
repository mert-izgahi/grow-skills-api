import express from "express";
import {
    getAllEnrollments,
    getOneEnrollment,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
} from "./controller.js";
import { withAuth } from "../../middlewares/with-auth-middleware.js";

const router = express.Router();

router.get("/enrollments", getAllEnrollments);
router.get("/enrollments/:id", getOneEnrollment);
router.post("/enrollments", withAuth, createEnrollment);
router.patch("/enrollments/:id", withAuth, updateEnrollment);
router.delete("/enrollments/:id", withAuth, deleteEnrollment);

export { router };
