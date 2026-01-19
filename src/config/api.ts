// Supabase is now the primary backend
export const USE_BACKEND = process.env.EXPO_PUBLIC_USE_BACKEND !== 'false'; // Default to true, but can be disabled

// Import Supabase config
export { supabase, SUPABASE_ANON_KEY, SUPABASE_URL } from './supabase';

