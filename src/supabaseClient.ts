import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL detected:", supabaseUrl ? "Found (starts with " + supabaseUrl.substring(0, 5) + ")" : "MISSING");
console.log("Supabase Key detected:", supabaseAnonKey ? "Found" : "MISSING");

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  const errorMsg = `Invalid or missing Supabase URL: "${supabaseUrl}". Ensure it starts with https:// and is defined in .env.local as VITE_SUPABASE_URL.`;
  console.error(errorMsg);
  // We throw a more descriptive error than the library would
  throw new Error(errorMsg);
}

if (!supabaseAnonKey) {
  throw new Error('Supabase Anon Key is missing. Define VITE_SUPABASE_ANON_KEY in .env.local.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
