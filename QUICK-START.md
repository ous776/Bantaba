# Bantaba - Quick Start Guide

## ✅ Setup in 2 Steps

### 1. Install (use Command Prompt, not PowerShell)

```bash
npm install
```

### 2. Run

```bash
npm start
```

Then press `a` for Android, `i` for iOS, or `w` for Web.

## 📱 How It Works

### Home Screen
- Shows 4 language cards: Mandinka, Wolof, Jola, Fula
- Tap any language to start verifying translations

### Language Screen (e.g., Mandinka)
1. App shows random English word from your JSON data
2. Shows translation from your JSON file
3. You can edit if translation is wrong
4. Click **Submit** to save or **Skip** to next word
5. Counter shows how many you've verified

### Stats Screen
- View progress for each language
- See total verified, corrected, pending
- Export dataset to console

## 🎯 Example Flow

1. Open app → Tap "🇬🇲 Mandinka"
2. See: "hello" → "salaam" (from your JSON data)
3. Edit if needed: "salaam" → "i be di"
4. Tap **Submit** ✓
5. Next word appears automatically
6. Repeat!

## 💡 Tips

- **Edit freely**: Your JSON data might have errors, correct them
- **Skip if unsure**: Don't guess, skip and come back later
- **Track progress**: Top-right shows verified count
- **Export often**: Stats screen → Export Dataset

## 📊 Your Data Status

**Current Status:**
- ✅ **Mandinka**: ~28,000+ translations ready!
- ⚠️ **Wolof**: No data (will show placeholders)
- ⚠️ **Fula**: No data (will show placeholders)
- ⚠️ **Jola**: No data (will show placeholders)

## 🔧 Add More Data

To add data for other languages, edit JSON files in `/data/` directory:

```json
[
  {"english": "hello", "wolof": "nanga def"},
  {"english": "goodbye", "wolof": "ba beneen yoon"}
]
```

## 💰 Cost

✅ **Completely FREE!** No API costs. Uses your local JSON data only.

## 📈 Your Progress

All verifications save automatically to your device. Export anytime from Stats screen.

---

**Ready?** Run `npm start` and start verifying your translation data! 🚀

**Best Language to Start:** Mandinka (has the most data!)