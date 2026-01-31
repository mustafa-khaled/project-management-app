import { Router } from "express";
import passport from "passport";
import { config } from "@/config/app.config";
import {
  getCurrentUserController,
  googleLoginCallback,
  loginUserController,
  logoutController,
  registerUserController,
} from "@/controllers/auth.controller";
import { isAuthenticated } from "@/middlewares/auth.middleware";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;
const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout", logoutController);
router.get("/me", isAuthenticated, getCurrentUserController);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: true,
    failureRedirect: failedUrl,
  }),
  googleLoginCallback,
);

export default router;
