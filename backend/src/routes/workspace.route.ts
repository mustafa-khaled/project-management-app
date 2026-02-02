import {
  createWorkspaceController,
  getAllWorkspacesUserIsMemberController,
} from "@/controllers/workspace.controller";
import { Router } from "express";

const router = Router();

router.post("/create/new", createWorkspaceController);
router.get("/all", getAllWorkspacesUserIsMemberController);

export default router;
