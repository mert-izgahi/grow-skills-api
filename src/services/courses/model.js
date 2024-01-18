import mongoose from "mongoose";
import slugify from "slugify";
const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide title"],
            trim: true,
            unique: [true, "Title already exists"],
        },

        description: {
            type: String,
            required: [true, "Please provide description"],
            trim: true,
            max: [512, "Description can not be more than 512 characters"],
        },

        price: {
            type: Number,
            required: [true, "Please provide price"],
            trim: true,
            min: [0, "Price can not be negative"],
        },

        image: {
            type: String,
            required: [true, "Please provide image"],
            trim: true,
        },

        category: {
            type: String,
            required: [true, "Please provide category"],
            trim: true,
            enum: ["Dev", "Design", "Marketing", "Business", "IT", "Other"],
        },

        level: {
            type: String,
            required: [true, "Please provide level"],
            trim: true,
            enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
        },

        students: {
            type: Map,
            of: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: new Map(),
        },

        totalStudents: {
            type: Number,
            default: 0,
        },

        slug: {
            type: String,
            trim: true,
            unique: true,
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        published: {
            type: Boolean,
            default: false,
        },

        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

courseSchema.virtual("lessons", {
    ref: "Lesson",
    localField: "_id",
    foreignField: "course",
    justOne: false,
});

courseSchema.pre("findOne", function (next) {
    this.populate("instructor");
    this.populate("lessons");
    next();
});

courseSchema.pre("save", function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

courseSchema.statics.createOne = async function (data) {
    const course = await this.create(data);
    if (!course) {
        throw new BadRequestError("Course not created");
    }
    return course;
};

courseSchema.statics.getAll = async function (query) {
    const { limit, page, sort, search } = query;
    const skip = (page - 1) * limit;

    const courses = await this.find(search).limit(limit).skip(skip).sort(sort);

    if (!courses) {
        throw new BadRequestError("Courses not found");
    }

    const totalPages = Math.ceil(
        (await this.find(search).countDocuments()) / limit
    );
    return { courses, totalPages };
};

courseSchema.statics.getOne = async function (query) {
    const course = await this.findOne(query);
    if (!course) {
        throw new BadRequestError("Course not found");
    }
    return course;
};

courseSchema.statics.deleteOne = async function (query) {
    const course = await this.findOneAndDelete(query);
    if (!course) {
        throw new BadRequestError("Course not found");
    }
    return course;
};

courseSchema.statics.updateOne = async function (query, data) {
    const course = await this.findOneAndUpdate(query, data, {
        new: true,
    });
    if (data.title) {
        course.slug = slugify(data.title, { lower: true });
        await course.save();
    }
    if (!course) {
        throw new BadRequestError("Course not found");
    }
    return course;
};

courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;
