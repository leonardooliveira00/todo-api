import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user-route";
import taskRoutes from "./routes/task-route";
import authRoute from "./routes/auth-route";
import errorMiddleware from "./middlewares/error-middleware";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/auth", authRoute);
app.use(errorMiddleware);

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor em execução na porta ${PORT}`);
});
