import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MapMarker {
  id: string;
  icon_type: string;
  latitude: number;
  longitude: number;
  scale: number;
  rotation: number;
  flip_horizontal: boolean;
  flip_vertical: boolean;
  created_at: string;
  updated_at: string;
}
