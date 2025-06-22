import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 客户端使用 anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 服务端 API 使用 service role key (用于写操作)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
