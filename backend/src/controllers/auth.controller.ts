import { config } from "@/config/app.config";
import { catchAsync } from "@/utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "@/validation/auth.validation";
import { StatusCodes } from "http-status-codes";
import {
  registerUserService,
  verifyUserService,
} from "@/services/auth.service";
import passport from "passport";

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
    const body = registerSchema.parse({
      ...req.body,
    });

    await registerUserService(body);

    return res.status(StatusCodes.CREATED).json({
      message: "user created successfully.",
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
            message: "user logged in successfully.",
            user,
          });
        });
      },
    )(req, res, next);
  },
);

export const logoutController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.logOut((err) => {
      if (err) {
        console.log("Logout error:", err);

        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Logout failed.",
        });
      }

      req.session?.destroy((err) => {
        if (err) {
          console.log("Session destruction error:", err);
        }
      });

      return res.status(StatusCodes.OK).json({
        message: "user logged out successfully.",
      });
    });
  },
);

export const getCurrentUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(StatusCodes.OK).json({
      message: "User data retrieved successfully.",
      user: req.user,
    });
  },
);
