import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lmokijbafujgknwwroeg.supabase.co'
const supabaseAnonKey = 'sb_publishable_iwftIruDgKOaSYn4q7WI6w_TU3ETXkh'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
