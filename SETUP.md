# Bantaba Setup Guide

## Quick Start

### 1. Fix PowerShell Issue (Windows)

If you see "running scripts is disabled" error, use **Command Prompt (cmd)** instead:

1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to project: `cd "C:\Users\Nutzer\Desktop\MY FILES\Bantaba"`

### 2. Install Dependencies

```bash
npm install
```

### 3. Check Your Translation Data

Your app now uses local JSON files from the `/data/` directory:

**Current Status:**
- ✅ **Mandinka**: ~28,000+ translations loaded from `data/mandinka_lang.json`
- ⚠️ **Wolof**: Empty file `data/wolof_lang.json` 
- ⚠️ **Fula**: Empty file `data/fula_lang.json`
- ⚠️ **Jola**: Empty file `data/jola_lang.json`

### 4. Add Missing Language Data (Optional)

To add data for other languages, edit the JSON files in `/data/` directory:

**Format:**
```json
[
  {
    "english": "hello",
    "wolof": "nanga def"
  },
  {
    "english": "goodbye", 
    "wolof": "ba beneen yoon"
  }
]
```

### 5. Start the App

```bash
npm start
```

Then press:
- `a` for Android
- `i` for iOS  
- `w` for Web

## How It Works

### Main Flow

1. **Home Screen**: Select a language (Mandinka, Wolof, Jola, or Fula)
2. **Language Screen**: 
   - App shows a random English word from your JSON data
   - Shows the translation from your JSON file
   - You can edit the translation if needed
   - Submit to save or Skip to next word
3. **Stats Screen**: View progress and export dataset

### Features

- ✅ Uses your local JSON translation data
- 🎲 Random English words from your dataset
- ✏️ Edit translations before submitting
- ⏭️ Skip words you're unsure about
- 📊 Track progress per language
- 💾 All verifications stored locally
- 📤 Export verified dataset anytime

## Data Sources

### Mandinka (Working ✅)
- **File**: `data/mandinka_lang.json`
- **Entries**: ~28,000+ translations
- **Status**: Ready to use!

### Other Languages (Need Data ⚠️)
- **Wolof**: `data/wolof_lang.json` (empty)
- **Fula**: `data/fula_lang.json` (empty)  
- **Jola**: `data/jola_lang.json` (empty)

**For empty files**: The app will show placeholder translations like `[WO] hello` until you add real data.

## Adding Translation Data

### Option 1: Manual Entry
1. Open the JSON file (e.g., `data/wolof_lang.json`)
2. Add translations in this format:
```json
[
  {"english": "hello", "wolof": "nanga def"},
  {"english": "goodbye", "wolof": "ba beneen yoon"}
]
```

### Option 2: Import from CSV
If you have CSV data, convert it to JSON format and add to the files.

### Option 3: Use Existing Mandinka Data
The Mandinka file has extensive data. You can:
1. Copy entries from `mandinka_lang.json`
2. Add translations for other languages
3. Build comprehensive multilingual dataset

## Data Storage

All user verifications are stored locally using AsyncStorage:
- **Translations**: `@bantaba_translations`
- **Verifications**: `@bantaba_verifications`

## Export Dataset

From the Stats screen, tap "Export Dataset" to:
1. Log all data to console
2. View summary by language
3. Copy for external use

## Troubleshooting

### "No translation data available for [language]"

**Solution:** Add data to the corresponding JSON file in `/data/` directory.

### App shows placeholder translations like "[WO] hello"

**Solution:** This means the JSON file is empty. Add real translation data.

### App Won't Start

```bash
# Clear cache
npm start -- --clear

# Or reset completely
rmdir /s /q node_modules
npm install
```

### "Cannot find module" Errors

```bash
npm install
```

## Next Steps

1. Add translation data to empty JSON files
2. Test with different languages
3. Build comprehensive verified dataset
4. Export data for training or analysis

## Cost

✅ **Completely FREE!** No API costs, no subscriptions. Uses your local data only.

---

**Ready to start?** Run `npm start` and begin verifying your Mandinka translations! 🚀