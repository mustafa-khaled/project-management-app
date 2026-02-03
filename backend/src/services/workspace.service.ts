import mongoose from "mongoose";
import { RoleEnum } from "@/enums/role.enum";
import { NotFoundException } from "@/utils/ApiError";
import RoleModel from "@/models/roles-permission.model";
import UserModel from "@/models/user.model";
import WorkspaceModel from "@/models/workspace.model";
import MemberModel from "@/models/member.model";

export const createWorkspaceService = async (
  userId: string,
  body: {
    name: string;
    description?: string | undefined;
  },
) => {
  const { name, description } = body;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const ownerRole = await RoleModel.findOne({ name: RoleEnum.OWNER });

  if (!ownerRole) {
    throw new NotFoundException("Owner role not found");
  }

  const workspace = await WorkspaceModel.create({
    name,
    description,
    owner: user._id,
  });

  await workspace.save();

  const member = new MemberModel({
    userId: user._id,
    workspaceId: workspace._id,
    roleId: ownerRole._id,
    joinedAt: new Date(),
  });

  await member.save();

  user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;

  return { workspace };
};

export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  const memberships = await MemberModel.find({
    userId: new mongoose.Types.ObjectId(userId),
  })
    .populate("workspaceId")
    .exec();

  const workspaces = memberships.map((membership) => membership.workspaceId);

  return { workspaces };
};

export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const members = await MemberModel.find({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
  }).populate("roleId");

  return {
    workspace: {
      ...workspace.toObject(),
      members,
    },
  };
};

export const getWorkspaceMembersService = async (workspaceId: string) => {
  const members = await MemberModel.find({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
  })
    .populate("userId", "name email profilePicture")
    .populate("roleId", "name");

  const roles = await RoleModel.find({}, { name: 1, _id: 1 })
    .select("-permissions")
    .lean();

  return { members, roles };
};
