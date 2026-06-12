import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

// Si faltan las variables, usamos placeholders para no romper el build;
// la UI mostrará un aviso de configuración.
export const supabase = createClient(url ?? 'https://placeholder.supabase.co', anonKey ?? 'placeholder', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type Role = 'superadmin' | 'cafe_admin' | 'staff'

export interface Profile {
  id: string
  full_name: string | null
  role: Role
  cafe_id: string | null
}

export interface Cafe {
  id: string
  name: string
  slug: string | null
  club_price: number
  retail_price: number
  cogs: number
  cap_per_day: number
  club_format: 'included_daily' | 'percent_discount' | 'prepaid' | 'perks'
  perk: string | null
  saas_tier: 'lite' | 'pro' | 'plus'
  saas_price: number
  active: boolean
  created_at: string
}
