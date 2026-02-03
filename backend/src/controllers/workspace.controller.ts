import {
  createWorkspaceService,
  getAllWorkspacesUserIsMemberService,
  getWorkspaceByIdService,
  getWorkspaceMembersService,
} from "@/services/workspace.service";
import { UserDocument } from "@/models/user.model";
import { catchAsync } from "@/utils/catchAsync";
import {
  createUpdateWorkspaceSchema,
  workspaceIdSchema,
} from "@/validation/workspace.validation";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { getMemberRoleInWorkspace } from "@/services/member.service";
import { PermissionEnum } from "@/enums/role.enum";
import { roleGuard } from "@/utils/roleGuard";

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

export const getWorkspaceByIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const user = req.user as UserDocument;
    const userId = user._id.toString();

    await getMemberRoleInWorkspace(userId, workspaceId);

    const { workspace } = await getWorkspaceByIdService(workspaceId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Workspace fetched successfully",
      data: { workspace },
    });
  },
);

export const getWorkspaceMembersController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const user = req.user as UserDocument;
    const userId = user._id.toString();

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

    roleGuard(role, [PermissionEnum.VIEW_ONLY]);

    const { members, roles } = await getWorkspaceMembersService(workspaceId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Workspace members fetched successfully",
      data: { members, roles },
    });
  },
);
