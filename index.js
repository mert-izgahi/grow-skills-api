import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import config from "./config.js";
import connectDB from "./src/helpers/connect-db.js";
import errorHandler from "./src/middlewares/error-handler-middleware.js";
import notFound from "./src/middlewares/not-found-middleware.js";
import { serializeUser } from "./src/middlewares/serialize-user-middleware.js";
import { router as usersRouter } from "./src/services/users/router.js";
import { router as coursesRouter } from "./src/services/courses/router.js";
import { router as enrollmentsRouter } from "./src/services/enrollments/router.js";
import { router as lessonsRouter } from "./src/services/lessons/router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);
app.use(serializeUser);
app.get("/", (req, res) => {
    const docsPath = path.join(process.cwd(), "public", "index.html");
    if (!docsPath) {
        return res.status(404).send("File not found");
    }
    res.sendFile(docsPath);
});

const PORT = config.PORT;
app.listen(PORT, async () => {
    await connectDB(config.MONGO_URL);

    // ROUTERS
    app.use("/api/v1", usersRouter);
    app.use("/api/v1", coursesRouter);
    app.use("/api/v1", enrollmentsRouter);
    app.use("/api/v1", lessonsRouter);
    app.use(errorHandler);
    app.use(notFound);
    console.log(`Server started on http://localhost:${PORT}`);
});
