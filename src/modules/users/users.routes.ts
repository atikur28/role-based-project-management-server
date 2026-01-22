import { Router } from "express";
import { authorize, protect } from "../../middleware/auth";
import { usersControllers } from "./users.controller";

const router = Router();

router.use(protect, authorize(["ADMIN"]));

router.get("/", usersControllers.getUsers);

router.patch("/:id/role", usersControllers.updateUserRole);

router.patch("/:id/status", usersControllers.updateUserStatus);

export const usersRoutes = router;
