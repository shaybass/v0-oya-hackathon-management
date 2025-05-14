import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Singleton pattern for client-side Supabase client
let clientSupabaseClient: ReturnType<typeof createClient> | null = null

export function createClientSupabaseClient() {
  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  clientSupabaseClient = createClient(supabaseUrl, supabaseKey)

  return clientSupabaseClient
}

// Реэкспорт для обратной совместимости from './supabase-server' from './supabase-client'
