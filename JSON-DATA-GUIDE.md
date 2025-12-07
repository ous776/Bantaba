# JSON Translation Data Guide

## 📁 Current Data Status

### Mandinka ✅
- **File**: `data/mandinka_lang.json`
- **Entries**: ~28,000+ translations
- **Status**: Ready to use!
- **Sample**: `{"english": "hello", "mandinka": "salaam"}`

### Other Languages ⚠️
- **Wolof**: `data/wolof_lang.json` (empty)
- **Fula**: `data/fula_lang.json` (empty)
- **Jola**: `data/jola_lang.json` (empty)

## 📝 JSON Format

Each language file should contain an array of translation objects:

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
  },
  {
    "english": "thank you",
    "mandinka": "abaraka",
    "wolof": "jerejef",
    "fula": "a jaarama",
    "jola": "asukran"
  }
]
```

## 🔧 How the App Uses Your Data

### 1. Random Word Selection
- App picks random English word from your JSON data
- For Mandinka: picks from 28,000+ words
- For empty files: uses fallback words

### 2. Translation Lookup
- Searches for exact English match first
- Falls back to partial matches if needed
- Shows placeholder if no match found

### 3. User Verification
- Shows the translation from JSON
- User can edit if incorrect
- Saves verification to local storage

## 📊 Data Quality Tips

### Good Entries ✅
```json
{"english": "water", "mandinka": "jii"}
{"english": "house", "mandinka": "bugu"}
{"english": "food", "mandinka": "domoo"}
```

### Problematic Entries ⚠️
```json
{"english": "a cob", "mandinka": "tugho."}  // Extra punctuation
{"english": "addition", "mandinka": "kafundagho  address"}  // Multiple words
{"english": "", "mandinka": "salaam"}  // Empty English
```

## 🛠️ Adding Data to Empty Files

### For Wolof (`data/wolof_lang.json`):
```json
[
  {"english": "hello", "wolof": "nanga def"},
  {"english": "goodbye", "wolof": "ba beneen yoon"},
  {"english": "thank you", "wolof": "jerejef"},
  {"english": "please", "wolof": "bu la neexee"},
  {"english": "yes", "wolof": "waaw"},
  {"english": "no", "wolof": "déedéet"}
]
```

### For Fula (`data/fula_lang.json`):
```json
[
  {"english": "hello", "fula": "jam"},
  {"english": "goodbye", "fula": "sellam"},
  {"english": "thank you", "fula": "a jaarama"},
  {"english": "please", "fula": "tawi"},
  {"english": "yes", "fula": "eey"},
  {"english": "no", "fula": "alaa"}
]
```

### For Jola (`data/jola_lang.json`):
```json
[
  {"english": "hello", "jola": "kasumay"},
  {"english": "goodbye", "jola": "kasumay"},
  {"english": "thank you", "jola": "asukran"},
  {"english": "please", "jola": "ñaading"},
  {"english": "yes", "jola": "haa"},
  {"english": "no", "jola": "ñaani"}
]
```

## 🔄 Data Sources

### Where to Get Translation Data

1. **Existing Dictionaries**
   - Convert PDF/Word dictionaries to JSON
   - Use online translation resources

2. **Community Contributions**
   - Work with native speakers
   - Crowdsource translations

3. **Expand Mandinka Data**
   - Use existing Mandinka entries as base
   - Add translations for other languages

4. **Academic Resources**
   - University linguistics departments
   - Language preservation projects

## 📈 Data Statistics

Run the app to see current data stats:
- Mandinka: 28,935 entries
- Wolof: 0 entries
- Fula: 0 entries  
- Jola: 0 entries

## 🎯 Recommended Workflow

### Phase 1: Use Existing Mandinka Data
1. Start with Mandinka (has most data)
2. Verify and correct translations
3. Build quality dataset

### Phase 2: Add Core Vocabulary
1. Add 100-500 common words for other languages
2. Focus on: greetings, family, food, numbers, verbs
3. Test app functionality

### Phase 3: Expand Dataset
1. Add more comprehensive vocabulary
2. Include specialized terms
3. Build complete translation datasets

## 🚨 Important Notes

- **Backup your data**: Keep copies of JSON files
- **Validate JSON**: Use JSON validator to check syntax
- **Test incrementally**: Add small batches and test
- **Quality over quantity**: Better to have fewer accurate translations

## 🔍 Troubleshooting

### "No translation data available"
- Check if JSON file exists in `/data/` directory
- Verify JSON syntax is valid
- Ensure file is not empty

### App shows "[WO] hello" placeholders
- This means no data found for that language
- Add translations to the corresponding JSON file

### JSON syntax errors
- Use online JSON validator
- Check for missing commas, brackets
- Ensure proper quote formatting

---

**Ready to add data?** Start with a small sample, test it, then expand! 🚀