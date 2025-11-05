import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cachedClient) return cachedClient;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env and restart the dev server."
    );
  }
  cachedClient = createClient(supabaseUrl, supabaseAnonKey);
  return cachedClient;
}


