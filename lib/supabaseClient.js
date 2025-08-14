import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vnjvmgbwumadrjxaxash.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuanZtZ2J3dW1hZHJqeGF4YXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzg2NjksImV4cCI6MjA3MDc1NDY2OX0.yDaGx0nZkMmkZeNoZplAkZ12NeTuqHiQvjGc5mZ1RcU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
