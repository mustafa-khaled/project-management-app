import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Name is required" })
  .max(255, { message: "Name must be at most 255 characters long" });

export const descriptionSchema = z.string().trim().optional();

export const createUpdateWorkspaceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

export type CreateUpdateWorkspaceInput = z.infer<
  typeof createUpdateWorkspaceSchema
>;
