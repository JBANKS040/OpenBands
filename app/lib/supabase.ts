import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CompanyRatings {
  work_life_balance: number;
  culture_values: number;
  career_growth: number;
  compensation_benefits: number;
  leadership_quality: number;
  operational_efficiency: number;
}

export interface Submission {
  id?: string;
  //id: string;
  created_at?: string;
  //created_at: string;
  domain: string;
  position: string;
  salary: string;
  proof?: Uint8Array;
  //proof: Uint8Array;
  jwt_pub_key?: JsonWebKey;
  ratings?: CompanyRatings;
  rsa_signature_length?: number;   // 9 or 18
} 