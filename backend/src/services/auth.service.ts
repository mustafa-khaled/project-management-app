import { RoleEnum } from "@/enums/role.enum";
import AccountModel from "@/models/account.model";
import MemberModel from "@/models/member.model";
import rolesPermissionModel from "@/models/roles-permission.model";
import UserModel from "@/models/user.model";
import WorkspaceModel from "@/models/workspace.model";
import { NotFoundException } from "@/utils/ApiError";
import mongoose from "mongoose";

interface LoginOrCreateAccountServiceData {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}

export const loginOrCreateAccountService = async (
  data: LoginOrCreateAccountServiceData,
) => {
  const { provider, displayName, providerId, picture, email } = data;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    let user = await UserModel.findOne({ email }).session(session);

    if (!user) {
      // 1): Create new user if ir doesn't exist
      user = new UserModel({
        name: displayName,
        email,
        profilePicture: picture,
        provider,
        providerId,
      });

      await user.save({ session });
      const account = new AccountModel({
        userId: user._id,
        provider,
        providerId,
      });

      await account.save({ session });

      // 2): Create new workspace for the new user
      const workspace = new WorkspaceModel({
        name: "My workspace",
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });

      await workspace.save({ session });

      const ownerRole = await rolesPermissionModel
        .findOne({
          name: RoleEnum.OWNER,
        })
        .session(session);

      if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
      }

      const member = new MemberModel({
        workspaceId: workspace._id,
        userId: user._id,
        role: ownerRole._id,
      });

      await member.save({ session });

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    }

    await session.commitTransaction();
    return { user };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
