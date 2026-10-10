import { createClient } from '@supabase/supabase-js';

// Defensively strip any '/rest/v1' suffix or trailing slashes to guarantee the base project URL
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const cleanSupabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  cleanSupabaseUrl &&
  supabaseAnonKey &&
  cleanSupabaseUrl.startsWith('https://') &&
  cleanSupabaseUrl !== 'https://your-project.supabase.co' &&
  !cleanSupabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(cleanSupabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    })
  : null;

/**
 * Diagnostic status for developers and settings screen
 */
export function getSupabaseStatus() {
  return {
    isConfigured: isSupabaseConfigured,
    mode: isSupabaseConfigured ? 'cloud_supabase' : 'local_development',
    url: isSupabaseConfigured ? cleanSupabaseUrl : 'Not configured (Local Development Mode)',
    hasAnonKey: Boolean(supabaseAnonKey),
  };
}

/**
 * Performs a live ping to verify Supabase connectivity
 */
export async function verifySupabaseConnection() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      mode: 'local_development',
      message: 'Running in local development mode. Cloud Supabase credentials are not populated in .env.'
    };
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return {
      connected: true,
      mode: 'cloud_supabase',
      message: 'Successfully connected to Supabase cloud authentication service.'
    };
  } catch (err) {
    return {
      connected: false,
      mode: 'connection_error',
      message: `Failed to reach Supabase project: ${err.message}`
    };
  }
}
