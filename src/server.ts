import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import userRoutes from "./routes/user-route";
import taskRoutes from "./routes/task-route";
import authRoute from "./routes/auth-route";
import errorMiddleware from "./middlewares/error-middleware";
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/auth", authRoute);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3333;
app.listen(Number(PORT), "0.0.0.0", () => {});
