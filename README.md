# Bantaba - West African Language Translation App

A React Native app for building word datasets for **Mandinka, Wolof, Jola, and Fula** languages through AI-powered translation generation and user verification.

## 🌍 Supported Languages

- 🇬🇧 **English** (source language)
- 🇬🇲 **Mandinka** - Gambia, Senegal, Guinea
- 🇸🇳 **Wolof** - Senegal, Gambia, Mauritania
- 🇸🇳 **Jola (Joola)** - Senegal, Gambia, Guinea-Bissau
- 🇬🇳 **Fula (Fulfulde)** - West Africa

## ✨ Features

- **Translation Generation**: Generate translations using AI models (OpenAI, custom APIs)
- **User Verification**: Verify, correct, and submit translations with notes
- **Batch Processing**: Generate multiple translations at once
- **Dataset Management**: Track statistics and export verified data
- **Category Support**: Organize words by categories (greetings, food, etc.)

## 🚀 Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up Supabase (Required for backend):**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the migration script from `supabase_migration.sql`
   - Get your Supabase URL and anon key from Settings > API
   - Create a `.env` file in the root directory:
     ```bash
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     EXPO_PUBLIC_USE_BACKEND=true
     ```
   - See `SUPABASE_SCHEMA.md` for detailed setup instructions

3. **Add your translation data (Optional - for local fallback):**
   - Add JSON files to `/data/` directory:
     - `mandinka_lang.json` ✅ (already added)
     - `wolof_lang.json` (empty - add your data)
     - `fula_lang.json` (empty - add your data)  
     - `jola_lang.json` (empty - add your data)

4. **Start the app:**
```bash
npm start
```

Then press `a` for Android, `i` for iOS, or `w` for Web.

## ⚙️ Configuration

### Supabase Backend

The app now uses **Supabase** as the primary backend database. All translations are stored in Supabase and synced across devices.

- **Primary Storage**: Supabase PostgreSQL database
- **Local Cache**: AsyncStorage (for offline support and fallback)
- **Setup**: See `SUPABASE_SCHEMA.md` for database schema and setup instructions

### JSON Data Format

Your JSON files should follow this structure:

```json
[
  {
    "english": "hello",
    "mandinka": "salaam",
    "wolof": "nanga def",
    "fula": "jam",
    "jola": "kasumay"
  },
  {
    "english": "goodbye", 
    "mandinka": "fo dii",
    "wolof": "ba beneen yoon",
    "fula": "sellam",
    "jola": "kasumay"
  }
]
```

**Current Status:**
- ✅ **Mandinka**: ~28,000+ translations loaded
- ⚠️ **Wolof**: No data (add to `data/wolof_lang.json`)
- ⚠️ **Fula**: No data (add to `data/fula_lang.json`)
- ⚠️ **Jola**: No data (add to `data/jola_lang.json`)

## 📁 Project Structure

```
src/
├── config/
│   └── languages.ts      # Language definitions
├── screens/
│   ├── HomeScreen.tsx
│   ├── TranslationVerificationScreen.tsx
│   └── DatasetManagementScreen.tsx
├── services/
│   ├── TranslationService.ts
│   └── StorageService.ts
└── types/
    └── index.ts          # TypeScript interfaces
```

## 📊 How to Use

1. **Select Language**: Choose Mandinka, Wolof, Jola, or Fula from home screen
2. **Review Translation**: App shows random English word with AI translation
3. **Edit if Needed**: Modify the translation if it's incorrect
4. **Submit or Skip**: Save verified translation or skip to next word
5. **Track Progress**: View statistics and export dataset anytime

### Workflow per Language

Each language has its own screen where you:
- Get a random English word
- See OpenAI-generated translation
- Edit the translation if needed
- Submit (saves to dataset) or Skip (moves to next word)
- Track your progress in real-time

## 🗄️ Database

The app uses **Supabase** (PostgreSQL) for data storage. See `SUPABASE_SCHEMA.md` for:
- Database schema documentation
- SQL migration scripts
- Security policies (RLS)
- Setup instructions

## 🔜 Next Steps

1. ✅ ~~Set up backend sync for collaborative dataset building~~ (Done - using Supabase)
2. Add audio recording/playback for pronunciation verification
3. Implement CSV/JSON batch import
4. Add user authentication
5. Integrate speech-to-text for audio transcription

## 📱 Built with Expo

This is an [Expo](https://expo.dev) project using [file-based routing](https://docs.expo.dev/router/introduction).
