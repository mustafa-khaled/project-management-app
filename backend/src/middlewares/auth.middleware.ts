import { UnauthorizedException } from "@/utils/ApiError";
import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next();
  }

  throw new UnauthorizedException("Unauthorized. Please log in.");
};
