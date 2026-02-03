import { ErrorCodeEnum } from "@/enums/error-code.enum";
import MemberModel from "@/models/member.model";
import WorkspaceModel from "@/models/workspace.model";
import { RoleDocument } from "@/models/roles-permission.model";
import { NotFoundException, UnauthorizedException } from "@/utils/ApiError";

export const getMemberRoleInWorkspace = async (
  userId: string,
  workspaceId: string,
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate("roleId");

  if (!member) {
    throw new UnauthorizedException(
      "You are not a member of this workspace.",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED,
    );
  }

  const role = member.roleId as unknown as RoleDocument;

  return {
    role,
  };
};
