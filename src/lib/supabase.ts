import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fbwtpezpzrhdkzpbrnzl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZid3RwZXpwenJoZGt6cGJybnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NjkxNzksImV4cCI6MjA1MTA0NTE3OX0.WJD78P5_qhNczXeMT3OvC6WpzHPnxoVGou3KAK8_cbw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);