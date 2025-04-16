import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Submission {
  id: string;
  created_at: string;
  domain: string;
  position: string;
  salary: string;
  proof: Uint8Array;
  jwt_pub_key: JsonWebKey;
} 