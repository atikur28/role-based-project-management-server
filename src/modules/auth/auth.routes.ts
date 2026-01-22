import { Router } from "express";
import { authorize, protect } from "../../middleware/auth";
import { authControllers } from "./auth.controllers";

const router = Router();

router.post("/login", authControllers.login);

router.get("/invite", authControllers.getInvites);

router.post(
  "/invite",
  protect,
  authorize(["ADMIN"]),
  authControllers.createInvite,
);

router.post("/register-via-invite", authControllers.registerViaInvite);

export const authRoutes = router;
