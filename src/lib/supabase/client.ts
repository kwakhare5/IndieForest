import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );

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
