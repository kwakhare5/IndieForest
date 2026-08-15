import { createClient } from "@/utils/supabase/client";

export { createClient };

export async function signInWithGoogle() {
  const supabase = createClient();
  const redirectTo = typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback`
    : "http://localhost:3000/auth/callback";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw error;
  }

  return { success: true, data };
}

export async function signInWithGithub() {
  const supabase = createClient();
  const redirectTo = typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback`
    : "http://localhost:3000/auth/callback";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo,
    },
  });

  if (error) {
    throw error;
  }

  return { success: true, data };
}

export async function signOutUser() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
