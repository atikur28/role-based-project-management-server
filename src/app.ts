import cors from "cors";
import express, { Request, Response } from "express";
import config from "./config";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import { authRoutes } from "./modules/auth/auth.routes";
import { projectsRoutes } from "./modules/projects/projects.routes";
import { usersRoutes } from "./modules/users/users.routes";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin:
      config.client_api || "https://project-management-client-orpin.vercel.app",
    credentials: true,
  }),
);

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running........");
});

app.use("/auth", authRoutes);

app.use("/users", usersRoutes);

app.use("/projects", projectsRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
    path: req.path,
  });
});

export default app;
