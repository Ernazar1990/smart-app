
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  process.env.VITE_SUPABASE_URL || 
  'https://xdogbiyqcrrjlddmgiti.supabase.co';

const supabaseAnonKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  '';

const finalUrl = supabaseUrl && supabaseUrl.startsWith('http') 
  ? supabaseUrl 
  : 'https://placeholder-project.supabase.co';

const finalKey = supabaseAnonKey || 'placeholder-key';

// Ескертуді тек консольге шығару, бірақ қосымшаны құлатпау
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.debug("Supabase keys missing. App will function with static data.");
}

export const supabase = createClient(finalUrl, finalKey);
