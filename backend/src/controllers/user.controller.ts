import { catchAsync } from "@/utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UnauthorizedException } from "@/utils/ApiError";
import { getUserByIdService } from "@/services/user.service";

export const getCurrentUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedException("Not authenticated");
    }

    const userId = (req.user as any)._id;

    const user = await getUserByIdService(userId);

    return res.status(StatusCodes.OK).json({
      message: "User data retrieved successfully.",
      user,
    });
  },
);
