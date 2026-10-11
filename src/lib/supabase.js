import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const configured = Boolean(url && anonKey);
export const authClient = { configured, supabase: configured ? createClient(url, anonKey, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}) : null };
