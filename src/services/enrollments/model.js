import mongoose from "mongoose";
import crypto from "crypto";
const enrollmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        status: {
            type: String,
            enum: ["cancelled", "completed", "failed", "pending"],
            default: "pending",
        },

        clientSecret: {
            type: String,
            default: crypto.randomBytes(32).toString("hex"),
        },

        paymentIntentId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

enrollmentSchema.pre("find", function (next) {
    this.populate("user");
    this.populate("course");
    next();
});

enrollmentSchema.statics.getOne = async function (query) {
    const enrollment = await this.findOne(query);
    if (!enrollment) {
        throw new BadRequestError("Enrollment not found");
    }
    return enrollment;
};

enrollmentSchema.statics.deleteOne = async function (query) {
    const enrollment = await this.findOneAndDelete(query);
    if (!enrollment) {
        throw new BadRequestError("Enrollment not found");
    }
    return enrollment;
};

enrollmentSchema.statics.updateOne = async function (query, data) {
    const enrollment = await this.findOneAndUpdate(query, data, {
        new: true,
    });
    if (!enrollment) {
        throw new BadRequestError("Enrollment not found");
    }
    return enrollment;
};

enrollmentSchema.statics.createOne = async function (data) {
    const enrollment = await this.create(data);
    if (!enrollment) {
        throw new BadRequestError("Enrollment not created");
    }
    return enrollment;
};

enrollmentSchema.statics.getAll = async function (query) {
    const { limit, page, sort, search } = query;
    const skip = (page - 1) * limit;

    const enrollments = await this.find(search)
        .limit(limit)
        .skip(skip)
        .sort(sort);

    if (!enrollments) {
        throw new BadRequestError("Enrollments not found");
    }

    const totalPages = Math.ceil(
        (await this.find(search).countDocuments()) / limit
    );

    return { enrollments, totalPages };
};

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
