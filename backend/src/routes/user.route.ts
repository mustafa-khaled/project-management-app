import { getCurrentUserController } from "@/controllers/user.controller";
import { isAuthenticated } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/current", isAuthenticated, getCurrentUserController);

export default router;
