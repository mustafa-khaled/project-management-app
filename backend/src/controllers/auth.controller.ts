import { config } from "@/config/app.config";
import { catchAsync } from "@/utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import {
  getUserByIdService,
  getUserWorkspacesService,
  registerUserService,
} from "@/services/auth.service";
import passport from "passport";
import { UnauthorizedException } from "@/utils/ApiError";

export const googleLoginCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentWorkspace = (req.user as any)?.currentWorkspace;

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`,
      );
    }

    return res.redirect(
      `${config.FRONTEND_GOOGLE_CALLBACK_URL}/workspace/${currentWorkspace}`,
    );
  },
);

export const registerUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, workspaceId } = await registerUserService(req.body);

    return res.status(StatusCodes.CREATED).json({
      message: "User created successfully.",
      data: {
        userId,
        workspaceId,
      },
    });
  },
);

export const loginUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined,
      ) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password.",
          });
        }

        req.login(user, (err) => {
          if (err) {
            return next(err);
          }

          return res.status(StatusCodes.OK).json({
            message: "Logged in successfully",
            user,
          });
        });
      },
    )(req, res, next);
  },
);

export const logoutController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.clearCookie("connect.sid");
        return res.status(StatusCodes.OK).json({
          message: "Logged out successfully",
        });
      });
    });
  },
);

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
