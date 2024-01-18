import mongoose from "mongoose";
import slugify from "slugify";
const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide title"],
            trim: true,
        },

        url: {
            type: String,
            required: [true, "Please provide url"],
            trim: true,
        },

        duration: {
            type: Number,
            required: [true, "Please provide duration"],
            trim: true,
        },

        slug: {
            type: String,
            trim: true,
            unique: true,
        },

        description: {
            type: String,
            trim: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        published: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

lessonSchema.pre("save", function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

lessonSchema.statics.createOne = async function (data) {
    const lesson = await this.create(data);
    if (!lesson) {
        throw new BadRequestError("Lesson not created");
    }
    return lesson;
};

lessonSchema.statics.updateOne = async function (id, data) {
    const lesson = await this.updateOne({ _id: id }, data);
    if (!lesson) {
        throw new BadRequestError("Lesson not updated");
    }
    return lesson;
};

lessonSchema.statics.deleteOne = async function (id) {
    const lesson = await this.deleteOne({ _id: id });
    if (!lesson) {
        throw new BadRequestError("Lesson not deleted");
    }
    return lesson;
};

lessonSchema.statics.getOne = async function (query) {
    const lesson = await this.findOne(query);
    if (!lesson) {
        throw new BadRequestError("Lesson not found");
    }
    return lesson;
};

lessonSchema.statics.getAll = async function (query) {
    const { limit, page, sort, search } = query;
    const skip = (page - 1) * limit;

    const lessons = await this.find(search).limit(limit).skip(skip).sort(sort);

    if (!lessons) {
        throw new BadRequestError("Lessons not found");
    }

    const totalPages = Math.ceil(
        (await this.find(search).countDocuments()) / limit
    );
    return { lessons, totalPages };
};

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
