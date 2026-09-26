import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dylqygcccgrarerfgupe.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_LvurRz8IiVEP8X3Xdpt3lQ_83PbSwc3';

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
