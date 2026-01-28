import { Router } from "express";
import passport from "passport";
import { config } from "@/config/app.config";
import {
  googleLoginCallback,
  loginUserController,
  registerUserController,
} from "@/controllers/auth.controller";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;
const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: failedUrl,
  }),
  googleLoginCallback,
);

export default router;
