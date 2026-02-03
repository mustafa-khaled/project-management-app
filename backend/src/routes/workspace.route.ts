import {
  createWorkspaceController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceByIdController,
  getWorkspaceMembersController,
} from "@/controllers/workspace.controller";
import { Router } from "express";

const router = Router();

router.post("/create/new", createWorkspaceController);
router.get("/all", getAllWorkspacesUserIsMemberController);
router.get("/members/:id", getWorkspaceMembersController);
router.get("/:id", getWorkspaceByIdController);

export default router;
