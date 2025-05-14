import { createClient } from "@supabase/supabase-js"

// Singleton pattern for client-side Supabase client
let clientSupabaseClient: ReturnType<typeof createClient> | null = null

export function createClientSupabaseClient() {
  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  clientSupabaseClient = createClient(supabaseUrl, supabaseKey)

  return clientSupabaseClient
}
