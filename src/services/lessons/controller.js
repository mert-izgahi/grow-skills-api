import asyncWrapper from "../../middlewares/async-wrapper-middleware.js";
import sendResponse from "../../helpers/send-response.js";
import Lesson from "./model.js";

export const getAllLessons = asyncWrapper(async (req, res) => {
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
    const { lessons, totalPages } = await Lesson.getAll(queryObj);
    sendResponse({
        res,
        status: 200,
        data: { lessons, totalPages },
        message: "Lessons fetched successfully",
    });
});

export const getOneLesson = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const lesson = await Lesson.getOne({ _id: id });
    sendResponse({
        res,
        status: 200,
        data: { lesson },
        message: "Lesson fetched successfully",
    });
});

export const createLesson = asyncWrapper(async (req, res) => {
    const userId = res.locals.user.id;
    req.body.instructor = userId;
    const lesson = await Lesson.createOne(req.body);
    sendResponse({
        res,
        status: 201,
        data: { lesson },
        message: "Lesson created successfully",
    });
});

export const updateLesson = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const lesson = await Lesson.updateOne({ _id: id }, req.body);
    sendResponse({
        res,
        status: 200,
        data: { lesson },
        message: "Lesson updated successfully",
    });
});

export const deleteLesson = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const lesson = await Lesson.deleteOne({ _id: id });
    sendResponse({
        res,
        status: 200,
        data: { lesson },
        message: "Lesson deleted successfully",
    });
});
