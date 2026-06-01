import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://capfyvyskyzgtmsjdzkv.supabase.co'
const SUPABASE_KEY = 'sb_publishable_om_mrNa9Grd2KM_apBkTOQ_2AsOQN6D'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
