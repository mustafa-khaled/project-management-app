"use server";

import { auth } from "@/utils/auth";
import { signupSchema } from "@/lib/types";
import { z } from "zod";

export async function signupAction(formData: z.infer<typeof signupSchema>) {
  try {
    await auth.signup(formData.email, formData.password);
    return { success: true };
  } catch (error) {
    console.log("ERROR", error);

    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
