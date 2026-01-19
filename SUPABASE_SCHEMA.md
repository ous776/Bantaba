# Supabase Database Schema

This document describes the database schema required for the Bantaba app to work with Supabase.

## Setup Instructions

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL migration script below
4. Copy your Supabase URL and anon key from Settings > API
5. Add them to your environment variables (see Configuration section below)

## Database Schema

### Table: `translations`

This table stores all translations from English to target languages (Mandinka, Wolof, Jola, Fula).

```sql
-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id BIGSERIAL PRIMARY KEY,
  english_word TEXT NOT NULL,
  language_code TEXT NOT NULL CHECK (language_code IN ('mnk', 'wo', 'ff', 'dyo')),
  translated_word TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'corrected')),
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  generated_by TEXT NOT NULL DEFAULT 'api' CHECK (generated_by IN ('ai', 'api')),
  audio_url TEXT,
  verified_at TIMESTAMPTZ,
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
CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security requirements)
-- For now, we'll allow all operations. You may want to restrict this later.

-- Allow anyone to read translations
CREATE POLICY "Allow public read access" ON translations
    FOR SELECT USING (true);

-- Allow anyone to insert translations
CREATE POLICY "Allow public insert access" ON translations
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update translations
CREATE POLICY "Allow public update access" ON translations
    FOR UPDATE USING (true);

-- Optional: Allow anyone to delete translations (you may want to restrict this)
CREATE POLICY "Allow public delete access" ON translations
    FOR DELETE USING (true);
```

### Optional: Table for Verifications

If you want to store verification results separately, you can create this table:

```sql
-- Create verifications table (optional)
CREATE TABLE IF NOT EXISTS verifications (
  id BIGSERIAL PRIMARY KEY,
  translation_id BIGINT NOT NULL REFERENCES translations(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  corrected_word TEXT,
  notes TEXT,
  verified_by TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_verifications_translation_id ON verifications(translation_id);
CREATE INDEX IF NOT EXISTS idx_verifications_verified_at ON verifications(verified_at DESC);

-- Enable RLS
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON verifications
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON verifications
    FOR INSERT WITH CHECK (true);
```

## Configuration

Add the following environment variables to your `.env` file or Expo configuration:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_USE_BACKEND=true
```

For Expo, you can also add these in `app.json` or `eas.json`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your_supabase_project_url",
      "supabaseAnonKey": "your_supabase_anon_key",
      "useBackend": true
    }
  }
}
```

Then update `src/config/supabase.ts` to use `expo-constants`:

```typescript
import Constants from 'expo-constants';
export const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
```

## Language Codes

The app uses the following language codes:
- `mnk` - Mandinka
- `wo` - Wolof
- `ff` - Fula (Fulfulde)
- `dyo` - Jola (Joola)

## Status Values

- `pending` - Translation has been generated but not yet verified
- `verified` - Translation has been verified as correct by a user
- `corrected` - Translation was corrected by a user

## Security Notes

⚠️ **Important**: The RLS policies above allow public access to all operations. This is fine for development and if you want a fully open dataset. However, for production, you should consider:

1. Adding authentication and restricting operations to authenticated users
2. Making read-only operations public but requiring auth for writes
3. Implementing rate limiting
4. Adding moderation features

Example of authenticated-only writes:

```sql
-- Only allow authenticated users to insert
DROP POLICY IF EXISTS "Allow public insert access" ON translations;
CREATE POLICY "Allow authenticated insert access" ON translations
    FOR INSERT TO authenticated WITH CHECK (true);
```

## Testing

After setting up the schema, you can test it with:

```sql
-- Insert a test translation
INSERT INTO translations (english_word, language_code, translated_word, status)
VALUES ('hello', 'mnk', 'salaam', 'pending');

-- Query translations
SELECT * FROM translations WHERE language_code = 'mnk';

-- Search translations
SELECT * FROM translations 
WHERE language_code = 'mnk' 
AND (english_word ILIKE '%hello%' OR translated_word ILIKE '%salaam%');
```
