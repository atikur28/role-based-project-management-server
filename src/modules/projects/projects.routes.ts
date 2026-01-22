import { Router } from "express";
import { authorize, protect } from "../../middleware/auth";
import { projectsControllers } from "./projects.controllers";

const router = Router();

router.use(protect);

router.post("/", projectsControllers.createProject);

router.get("/", projectsControllers.getProjects);

router.get("/:id", authorize(["ADMIN"]), projectsControllers.getProject);

router.patch("/:id", authorize(["ADMIN"]), projectsControllers.updateProject);

router.delete("/:id", authorize(["ADMIN"]), projectsControllers.deleteProject);

export const projectsRoutes = router;
