import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
import sendResponse from "../../helpers/send-response.js";
import BadRequestError from "../../errors/bad-request-error.js";
import Enrollment from "./model.js";
import Course from "../courses/model.js";

export const getAllEnrollments = asyncWrapper(async (req, res) => {
    const { limit, page, sort, search } = req.query;
    const skip = (page - 1) * limit;

    const enrollments = await Enrollment.getAll({ limit, skip, sort, search });
    sendResponse({
        res,
        status: 200,
        data: { enrollments },
        message: "Enrollments fetched successfully",
    });
});

export const getOneEnrollment = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const enrollment = await Enrollment.getOne({ _id: id });
    sendResponse({
        res,
        status: 200,
        data: { enrollment },
        message: "Enrollment fetched successfully",
    });
});

export const createEnrollment = asyncWrapper(async (req, res) => {
    const { course: courseId } = req.body;
    const userId = res.locals.user.id;
    const course = await Course.getOne({ _id: courseId });

    course.totalStudents = course.totalStudents + 1;
    const hasEnrolled = await course.students.get(userId);
    if (hasEnrolled) {
        throw new BadRequestError("Already enrolled");
    }

    await course.students.set(userId, {
        _id: userId,
    });
    await course.save();
    req.body.user = userId;
    const enrollment = await Enrollment.createOne(req.body);
    sendResponse({
        res,
        status: 201,
        data: { enrollment },
        message: "Enrollment created successfully",
    });
});

export const updateEnrollment = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const enrollment = await Enrollment.updateOne({ _id: id }, req.body);
    sendResponse({
        res,
        status: 200,
        data: { enrollment },
        message: "Enrollment updated successfully",
    });
});

export const deleteEnrollment = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const enrollment = await Enrollment.deleteOne({ _id: id });
    sendResponse({
        res,
        status: 200,
        data: { enrollment },
        message: "Enrollment deleted successfully",
    });
});
