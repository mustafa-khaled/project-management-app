import { StatusCodes } from "http-status-codes";
import { ErrorCode } from "@/enums/error-code.enum";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode?: ErrorCode;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCode,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
    };
  }
}

export class HttpException extends ApiError {
  constructor(message: string, statusCode: number, errorCode?: ErrorCode) {
    super(message, statusCode, errorCode);
  }
}

export class BadRequestException extends ApiError {
  constructor(message = "Bad request", errorCode?: ErrorCode) {
    super(message, StatusCodes.BAD_REQUEST, errorCode);
  }
}

export class UnauthorizedException extends ApiError {
  constructor(message = "Unauthorized", errorCode?: ErrorCode) {
    super(message, StatusCodes.UNAUTHORIZED, errorCode);
  }
}

export class ForbiddenException extends ApiError {
  constructor(message = "Forbidden", errorCode?: ErrorCode) {
    super(message, StatusCodes.FORBIDDEN, errorCode);
  }
}

export class NotFoundException extends ApiError {
  constructor(message = "Resource not found", errorCode?: ErrorCode) {
    super(message, StatusCodes.NOT_FOUND, errorCode);
  }
}

export class ConflictException extends ApiError {
  constructor(message = "Conflict", errorCode?: ErrorCode) {
    super(message, StatusCodes.CONFLICT, errorCode);
  }
}

export class UnprocessableEntityException extends ApiError {
  constructor(message = "Unprocessable entity", errorCode?: ErrorCode) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, errorCode);
  }
}

export class InternalServerException extends ApiError {
  constructor(message = "Internal server error", errorCode?: ErrorCode) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, errorCode);
  }
}

export class ServiceUnavailableException extends ApiError {
  constructor(message = "Service unavailable", errorCode?: ErrorCode) {
    super(message, StatusCodes.SERVICE_UNAVAILABLE, errorCode);
  }
}
