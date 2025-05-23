import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") || "/projects";

    if (!code) {
      console.error("No code provided in callback");
      throw new Error("No code provided");
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth error:", error);
      throw error;
    }

    // Redirect to the intended page
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  } catch (error) {
    console.error("Callback error:", error);
    // Add error to the URL so we can display it
    const errorUrl = new URL("/auth/auth-error", request.url);
    errorUrl.searchParams.set("error", "Failed to sign in");
    return NextResponse.redirect(errorUrl);
  }
}
