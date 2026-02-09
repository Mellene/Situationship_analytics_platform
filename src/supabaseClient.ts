import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is not defined in environment variables.');
  // Depending on your project's error handling, you might want to throw an error
  // or handle this more gracefully. For now, we'll log an error.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
