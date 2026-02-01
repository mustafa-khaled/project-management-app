import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { UnprocessableEntityException } from "@/utils/ApiError";

export const validate =
  (schema: z.ZodObject<any, any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        return next(
          new UnprocessableEntityException(
            errorMessages[0]?.message || "Validation failed",
          ),
        );
      }
      return next(error);
    }
  };
