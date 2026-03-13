
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  process.env.VITE_SUPABASE_URL || 
  'https://xdogbiyqcrrjlddmgiti.supabase.co';

const supabaseAnonKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkb2diaXlxY3JyamxkZG1naXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyOTI4NzQsImV4cCI6MjA4NDg2ODg3NH0.pDuX1ZaZPv4-9mUcjGp3w76ti9XNc0D9oXoSSdJrXHs';

const finalUrl = supabaseUrl && supabaseUrl.startsWith('http') 
  ? supabaseUrl 
  : 'https://placeholder-project.supabase.co';

const finalKey = supabaseAnonKey || 'placeholder-key';

// Ескертуді тек консольге шығару, бірақ қосымшаны құлатпау
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.debug("Supabase keys missing. App will function with static data.");
}

export const supabase = createClient(finalUrl, finalKey);

// Connection test
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('news').select('id').limit(1);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    let message = err.message;
    if (message === 'Failed to fetch') {
      message = 'Серверге қосылу мүмкін емес. Supabase жобасы тоқтатылған (Paused) болуы мүмкін.';
    }
    console.error("Supabase connection test failed:", message);
    return { success: false, error: message };
  }
};
