import { env } from './env'
import { createClient } from '@supabase/supabase-js'

// Cliente server-side con service_role — nunca exponer al browser
export function getSupabaseAdmin() {
  return createClient(
    env("SUPABASE_URL"),
    env("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  )
}
