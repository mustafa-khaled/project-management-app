import { createClient } from "./supabase/server";
import { users } from "./users";

export const auth = {
  async signup(email: string, password: string) {
    const supabase = await createClient();

    // 1): Check if the user already exist
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (existingUser) {
      throw new Error(
        "This email is already registered, Try signing in instead."
      );
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (signupError || !data.user) {
      throw new Error("Failed to create user account");
    }

    try {
      await users.captureUserDetails(data.user);
      return { success: true, user: data.user };
    } catch (profileError) {
      await supabase.auth.admin.deleteUser(data.user.id);
      throw profileError;
    }
  },
};

// login: async () => {},

// signupWithOAuth: async () => {},

// logout: async () => {},
