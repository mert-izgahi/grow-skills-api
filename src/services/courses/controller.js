import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
import sendResponse from "../../helpers/send-response.js";
import { uploadImage } from "../../helpers/upload-image.js";
import Course from "./model.js";
export const getAllCourses = asyncWrapper(async (req, res) => {
    const { limit, page, sort, search } = req.query;

    const queryObj = {
        page: page || 1,
        limit: limit || 10,
        sort: sort || "createdAt",
        search: {},
    };

    if (search) {
        queryObj.search = { title: { $regex: search, $options: "i" } };
    }
    const { courses, totalPages } = await Course.getAll(queryObj);
    sendResponse({
        res,
        status: 200,
        data: { courses, totalPages },
        message: "Courses fetched successfully",
    });
});

export const getOneCourse = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const course = await Course.getOne({ _id: id });
    sendResponse({
        res,
        status: 200,
        data: { course },
        message: "Course fetched successfully",
    });
});

export const createCourse = asyncWrapper(async (req, res) => {
    const image = req.files?.image;
    const userId = res.locals.user.id;
    if (image) {
        const secure_url = await uploadImage(image);
        req.body.image = secure_url;
    }
    req.body.instructor = userId;
    const course = await Course.createOne(req.body);
    sendResponse({
        res,
        status: 201,
        data: { course },
        message: "Course created successfully",
    });
});

export const updateCourse = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const course = await Course.updateOne({ _id: id }, req.body);
    sendResponse({
        res,
        status: 200,
        data: { course },
        message: "Course updated successfully",
    });
});

export const deleteCourse = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const course = await Course.deleteOne({ _id: id });
    sendResponse({
        res,
        status: 200,
        data: { course },
        message: "Course deleted successfully",
    });
});
