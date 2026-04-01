import { Router } from "express";
import * as controller from "./auth.controller";

const router = Router();

router.post("/signup", controller.signup);
router.get("/verify-email", controller.verifyEmail);
router.post("/login", controller.login);
router.post("/refresh", controller.refresh);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);
router.post("/google", controller.googleLogin);

export default router;