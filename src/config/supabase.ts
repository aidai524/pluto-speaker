import { createClient } from '@supabase/supabase-js'
import { Env } from '../types/env.types'

export function getSupabaseClient(env: Env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase credentials')
  }

  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
} 