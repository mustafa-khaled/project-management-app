import { createClient } from "./supabase/server";
import { users } from "./users";

const supabase = createClient();

export const auth = {
  signup: async (email: string, password: string) => {
    // 1): Check if the user already exist
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      throw error;
    }

    // if exist => throw an error
    if (existingUser) {
      throw new Error(
        "This email is already registered, Try signing in instead."
      );
    }

    // if not exist, signup
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signupError || !data.user) {
      throw new Error("Failed to create user account");
    }

    // save user details

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
