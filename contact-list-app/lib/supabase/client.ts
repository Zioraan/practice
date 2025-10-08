import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Provide fallback values for build time
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-anon-key-for-build";

  return createBrowserClient(url, key);
}
