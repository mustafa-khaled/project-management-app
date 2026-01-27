import { config } from "@/config/app.config";
import { catchAsync } from "@/utils/catchAsync";
import { Request, Response, NextFunction } from "express";

export const googleLoginCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentWorkspace = req.user?.currentWorkspace;

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
