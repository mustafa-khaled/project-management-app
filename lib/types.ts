import { z } from "zod";

// Shared field schemas
const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

// ✅ Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

//  Signup schema extends login schema
export const signupSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// Forgot password schema (email only)
export const forgotPasswordSchema = loginSchema.pick({
  email: true,
});

// Reset password schema (used after clicking reset link)
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const profileFormSchema = z.object({
  name: z
    .string({
      required_error: "Name must be provided.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Email address must be provided.",
    })
    .email(),
  description: z.string().max(160).optional(),
  links: z
    .array(
      z.object({
        label: z.string(),
        url: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
});

export type TProfileFormValues = z.infer<typeof profileFormSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;
export type TSignupSchema = z.infer<typeof signupSchema>;
export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
