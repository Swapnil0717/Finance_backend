import { Router } from "express";
import * as controller from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../validations/auth.validation";
import passport from "../../config/passport";

const router = Router();

router.post("/signup", validate({ body: signupSchema }), controller.signup);

router.get("/verify-email", controller.verifyEmail);

router.post("/login", validate({ body: loginSchema }), controller.login);

router.post("/refresh", controller.refresh);

router.post(
  "/forgot-password",
  validate({ body: forgotPasswordSchema }),
  controller.forgotPassword
);

router.post(
  "/reset-password",
  validate({ body: resetPasswordSchema }),
  controller.resetPassword
);


// 🔹 Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// 🔹 Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  controller.googleRedirect
);

router.post("/google", controller.googleLogin);

export default router;