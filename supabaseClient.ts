
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  process.env.VITE_SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  '';

const finalUrl = (supabaseUrl && supabaseUrl.startsWith('http') && !supabaseUrl.includes('placeholder'))
  ? supabaseUrl 
  : 'https://placeholder.supabase.co';

const finalKey = (supabaseAnonKey && supabaseAnonKey !== 'placeholder-key') ? supabaseAnonKey : 'placeholder-key';

// Ескертуді тек консольге шығару, бірақ қосымшаны құлатпау
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || finalUrl === 'https://placeholder.supabase.co') {
  console.debug("Supabase keys missing or invalid. App will function with static data.");
}

export const supabase = createClient(finalUrl, finalKey);

// Connection test
export const testSupabaseConnection = async () => {
  if (finalUrl.includes('placeholder')) return { success: false, error: 'Supabase not configured' };
  try {
    const { data, error } = await supabase.from('news').select('id').limit(1);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    let message = err.message || 'Unknown error';
    if (message === 'Failed to fetch' || err.name === 'TypeError') {
      message = 'Серверге қосылу мүмкін емес. Байланысты тексеріңіз немесе Supabase жобасының жиынтық деректерін тексеріңіз.';
    }
    console.warn("Supabase connection test unsuccessful:", message);
    return { success: false, error: message };
  }
};
