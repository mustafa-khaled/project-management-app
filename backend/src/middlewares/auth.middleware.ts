import { UnauthorizedException } from "@/utils/ApiError";
import { Request, Response, NextFunction } from "express";
import { UserDocument } from "@/models/user.model";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as UserDocument | undefined;

  if (!user || !user._id) {
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }

  next();
};
