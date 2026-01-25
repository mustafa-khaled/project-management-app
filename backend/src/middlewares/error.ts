import { NextFunction, Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import logger from "../utils/logger";
import { ApiError } from "../utils/ApiError";
import { config } from "@/config/app.config";
import { ErrorCodeEnum } from "@/enums/error-code.enum";

export const errorConverter = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      (error as any)?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;

    const message = (error as any)?.message ?? getReasonPhrase(statusCode);

    error = new ApiError(
      message,
      statusCode,
      ErrorCodeEnum.INTERNAL_SERVER_ERROR,
    );
  }

  next(error);
};

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const env = config.NODE_ENV;

  let { statusCode, message, errorCode } = err;

  // Hide internal errors in production
  if (env === "production" && !err.isOperational) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
    errorCode = ErrorCodeEnum.INTERNAL_SERVER_ERROR;
  }

  const response = {
    statusCode,
    message,
    errorCode,
    ...(env === "development" && { stack: err.stack }),
  };

  if (env === "development") {
    logger.error(err);
  }

  res.status(statusCode).json(response);
};
