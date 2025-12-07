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

2. **Add your translation data:**
   - Add JSON files to `/data/` directory:
     - `mandinka_lang.json` ✅ (already added)
     - `wolof_lang.json` (empty - add your data)
     - `fula_lang.json` (empty - add your data)  
     - `jola_lang.json` (empty - add your data)

3. **Start the app:**
```bash
npm start
```

Then press `a` for Android, `i` for iOS, or `w` for Web.

## ⚙️ Configuration

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

## 🔜 Next Steps

1. Add audio recording/playback for pronunciation verification
2. Implement CSV/JSON batch import
3. Add user authentication
4. Set up backend sync for collaborative dataset building
5. Integrate speech-to-text for audio transcription

## 📱 Built with Expo

This is an [Expo](https://expo.dev) project using [file-based routing](https://docs.expo.dev/router/introduction).
