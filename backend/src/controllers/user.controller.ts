import { catchAsync } from "@/utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UnauthorizedException } from "@/utils/ApiError";
import { getUserByIdService } from "@/services/user.service";

import { UserDocument } from "@/models/user.model";

export const getCurrentUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const userId = user._id.toString();

    const userData = await getUserByIdService(userId);

    return res.status(StatusCodes.OK).json({
      message: "User data retrieved successfully.",
      user: userData,
    });
  },
);
