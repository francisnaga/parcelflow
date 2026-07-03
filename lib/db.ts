import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseClient: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Missing Supabase public env vars");
    _supabaseClient = createClient(url, key);
  }
  return _supabaseClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Missing Supabase admin env vars");
    _supabaseAdmin = createClient(url, key);
  }
  return _supabaseAdmin;
}

// Backward-compatible named exports used in client components
export const supabaseClient = {
  from: (table: string) => getSupabaseClient().from(table),
  auth: {
    signInWithPassword: (creds: { email: string; password: string }) =>
      getSupabaseClient().auth.signInWithPassword(creds),
  },
};

export const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table),
};
