import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://cofrnevdytahhsjtnedl.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZnJuZXZkeXRhaGhzanRuZWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODg1MDUsImV4cCI6MjA5MzU2NDUwNX0.sZb3qba_E772u_yyvzZAhSipt5lnjgm03OmIVDh8qis';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
