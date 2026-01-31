import { ProviderEnum } from "@/enums/account-provider.enum";
import { RoleEnum } from "@/enums/role.enum";
import AccountModel from "@/models/account.model";
import MemberModel from "@/models/member.model";
import rolesPermissionModel from "@/models/roles-permission.model";
import UserModel from "@/models/user.model";
import WorkspaceModel from "@/models/workspace.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@/utils/ApiError";
import mongoose from "mongoose";

interface LoginOrCreateAccountServiceData {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}

interface RegisterServiceData {
  name: string;
  email: string;
  password: string;
}

interface VerifyUserServiceData {
  email: string;
  password: string;
  provider?: string;
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

export const registerUserService = async (body: RegisterServiceData) => {
  const { name, email, password } = body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const user = await UserModel.findOne({ email }).session(session);

    if (user) {
      throw new BadRequestException("User already exists");
    }

    const newUser = new UserModel({
      name,
      email,
      password,
    });

    await newUser.save({ session });

    const account = new AccountModel({
      userId: newUser._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });

    await account.save({ session });

    const workspace = new WorkspaceModel({
      name: "My workspace",
      description: `Workspace created for ${newUser.name}`,
      owner: newUser._id,
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
      userId: newUser._id,
      role: ownerRole._id,
    });

    await member.save({ session });

    newUser.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await newUser.save({ session });

    await session.commitTransaction();

    return { userId: newUser._id, workspaceId: workspace._id };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: VerifyUserServiceData) => {
  const account = await AccountModel.findOne({ provider, providerId: email });

  if (!account) {
    throw new NotFoundException("Invalid email or password");
  }

  const user = await UserModel.findById(account.userId).select(
    "+password +failedLoginAttempts +lockUntil",
  );

  if (!user) {
    throw new NotFoundException("User not found");
  }

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new BadRequestException(
      `Account is temporarily locked. Try again after ${user.lockUntil.toLocaleTimeString()}`,
    );
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    // Increment failed attempts
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes lockout
      user.failedLoginAttempts = 0;
    }

    await user.save();
    throw new UnauthorizedException("Invalid email or password");
  }

  // Reset failed attempts on successful login
  if (user.failedLoginAttempts > 0 || user.lockUntil) {
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
  }

  return user.omitPassword();
};
