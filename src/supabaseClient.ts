import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error('Supabase URL is missing or invalid. Check .env.local.');
}

if (!supabaseAnonKey) {
  throw new Error('Supabase Anon Key is missing. Check .env.local.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
