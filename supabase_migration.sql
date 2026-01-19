-- Supabase Migration Script for Bantaba App
-- Run this script in your Supabase SQL Editor

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id BIGSERIAL PRIMARY KEY,
  english_word TEXT NOT NULL,
  language_code TEXT NOT NULL CHECK (language_code IN ('mnk', 'wo', 'ff', 'jo')),
  translated_word TEXT NOT NULL,
  name TEXT NOT NULL REFERENCES users(name),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_translations_language_code ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_english_word ON translations(english_word);
CREATE INDEX IF NOT EXISTS idx_translations_status ON translations(status);
CREATE INDEX IF NOT EXISTS idx_translations_created_at ON translations(created_at DESC);

-- Create full-text search index for searching translations
CREATE INDEX IF NOT EXISTS idx_translations_search ON translations USING gin(to_tsvector('english', english_word || ' ' || translated_word));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_translations_updated_at ON translations;
CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON translations;
DROP POLICY IF EXISTS "Allow public insert access" ON translations;
DROP POLICY IF EXISTS "Allow public update access" ON translations;
DROP POLICY IF EXISTS "Allow public delete access" ON translations;

-- Create policies for public access (adjust based on your security requirements)
-- Allow anyone to read translations
CREATE POLICY "Allow public read access" ON translations
    FOR SELECT USING (true);

-- Allow anyone to insert translations
CREATE POLICY "Allow public insert access" ON translations
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update translations
CREATE POLICY "Allow public update access" ON translations
    FOR UPDATE USING (true);

-- Allow anyone to delete translations (you may want to restrict this)
CREATE POLICY "Allow public delete access" ON translations
    FOR DELETE USING (true);


-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Anonymous',
  email TEXT,
  phone TEXT,
  city TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  contribution_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Enable RLS for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON users;
DROP POLICY IF EXISTS "Allow public insert access" ON users;
DROP POLICY IF EXISTS "Allow public update access" ON users;

-- Create policies for users
CREATE POLICY "Allow public read access" ON users
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON users
    FOR UPDATE USING (true);

-- Create user_contributions table
CREATE TABLE IF NOT EXISTS user_contributions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  translation_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('verified', 'corrected', 'skipped')),
  language_code TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for user_contributions
CREATE INDEX IF NOT EXISTS idx_user_contributions_user_id ON user_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_contributions_translation_id ON user_contributions(translation_id);
CREATE INDEX IF NOT EXISTS idx_user_contributions_timestamp ON user_contributions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_contributions_language_code ON user_contributions(language_code);

-- Enable RLS for user_contributions
ALTER TABLE user_contributions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON user_contributions;
DROP POLICY IF EXISTS "Allow public insert access" ON user_contributions;

-- Create policies for user_contributions
CREATE POLICY "Allow public read access" ON user_contributions
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON user_contributions
    FOR INSERT WITH CHECK (true);