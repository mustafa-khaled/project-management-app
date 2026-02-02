import {
  createWorkspaceService,
  getAllWorkspacesUserIsMemberService,
} from "@/services/workspace.service";
import { UserDocument } from "@/models/user.model";
import { catchAsync } from "@/utils/catchAsync";
import { createUpdateWorkspaceSchema } from "@/validation/workspace.validation";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const createWorkspaceController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = createUpdateWorkspaceSchema.parse(req.body);

    const user = req.user as UserDocument;
    const userId = user._id.toString();

    const { workspace } = await createWorkspaceService(userId, body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Workspace created successfully",
      data: { workspace },
    });
  },
);

export const getAllWorkspacesUserIsMemberController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const userId = user._id.toString();

    const { workspaces } = await getAllWorkspacesUserIsMemberService(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User workspaces fetched successfully",
      data: { workspaces },
    });
  },
);
