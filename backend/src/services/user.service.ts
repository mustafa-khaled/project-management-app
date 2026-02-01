import UserModel from "@/models/user.model";
import { NotFoundException } from "@/utils/ApiError";

export const getUserByIdService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .populate("currentWorkspace")
    .select("-password");

  if (!user) {
    throw new NotFoundException("User not found");
  }

  return user;
};
