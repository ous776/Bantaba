import { LanguageCode, Translation } from '../types';

// Import JSON data files - using try/catch for empty files
let mandinkaData: any[] = [];
let wolofData: any[] = [];
let fulaData: any[] = [];
let jolaData: any[] = [];

try {
  mandinkaData = require('../../data/mandinka_lang.json') || [];
} catch (error) {
  console.warn('Could not load mandinka_lang.json');
  mandinkaData = [];
}

try {
  wolofData = require('../../data/wolof_lang.json') || [];
} catch (error) {
  console.warn('Could not load wolof_lang.json');
  wolofData = [];
}

try {
  fulaData = require('../../data/fula_lang.json') || [];
} catch (error) {
  console.warn('Could not load fula_lang.json');
  fulaData = [];
}

try {
  jolaData = require('../../data/jola_lang.json') || [];
} catch (error) {
  console.warn('Could not load jola_lang.json');
  jolaData = [];
}

class TranslationService {
  // Language data mapping
  private languageData: Record<LanguageCode, any[]> = {
    en: [], // English is source language
    mnk: mandinkaData,
    wo: wolofData,
    ff: fulaData,
    dyo: jolaData,
  };

  async generateTranslation(
    word: string,
    sourceLang: LanguageCode,
    targetLang: LanguageCode,
    category?: string,
  ): Promise<Translation> {
    try {
      console.log(`Looking up translation for "${word}" from ${sourceLang} to ${targetLang}`);
      
      const translatedWord = this.findTranslation(word, targetLang);
      console.log(`Found translation: ${translatedWord}`);

      return {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        sourceWord: word,
        targetWord: translatedWord,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        status: 'pending',
        generatedBy: 'api',
        createdAt: new Date(),
        category,
      };
    } catch (error) {
      console.error('Translation lookup failed:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  }

  private findTranslation(
    word: string,
    targetLang: LanguageCode,
  ): string {
    const targetData = this.languageData[targetLang];
    
    if (!targetData || targetData.length === 0) {
      console.warn(`No translation data available for ${targetLang}`);
      return `[${targetLang.toUpperCase()}] ${word}`;
    }

    // Search for exact match first
    let match = targetData.find((item: any) => 
      item.english && item.english.toLowerCase() === word.toLowerCase()
    );

    // If no exact match, try partial match
    if (!match) {
      match = targetData.find((item: any) => 
        item.english && item.english.toLowerCase().includes(word.toLowerCase())
      );
    }

    // If still no match, try reverse search (word contains the english term)
    if (!match) {
      match = targetData.find((item: any) => 
        item.english && word.toLowerCase().includes(item.english.toLowerCase())
      );
    }

    if (match) {
      // Get the translation based on target language
      const translationKey = this.getTranslationKey(targetLang);
      return match[translationKey] || `[No ${targetLang} translation]`;
    }

    // If no match found, return placeholder
    return `[${targetLang.toUpperCase()}] ${word}`;
  }

  private getTranslationKey(languageCode: LanguageCode): string {
    const keyMap: Record<LanguageCode, string> = {
      en: 'english',
      mnk: 'mandinka',
      wo: 'wolof',
      ff: 'fula',
      dyo: 'jola',
    };
    return keyMap[languageCode] || 'translation';
  }

  // Get a random English word from available translations
  getRandomEnglishWord(targetLang: LanguageCode): string {
    const targetData = this.languageData[targetLang];
    
    if (!targetData || targetData.length === 0) {
      // Fallback to sample words if no data
      const fallbackWords = [
        'hello', 'goodbye', 'thank you', 'please', 'yes', 'no',
        'water', 'food', 'house', 'family', 'friend', 'love',
        'good', 'bad', 'big', 'small', 'hot', 'cold'
      ];
      return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    }

    // Get random word from available data
    const randomIndex = Math.floor(Math.random() * targetData.length);
    const randomEntry = targetData[randomIndex];
    
    return randomEntry?.english || 'hello';
  }

  // Get statistics about available data
  getDataStats(): Record<LanguageCode, number> {
    return {
      en: 0,
      mnk: this.languageData.mnk?.length || 0,
      wo: this.languageData.wo?.length || 0,
      ff: this.languageData.ff?.length || 0,
      dyo: this.languageData.dyo?.length || 0,
    };
  }

  async batchGenerateTranslations(
    words: string[],
    sourceLang: LanguageCode,
    targetLang: LanguageCode,
    category?: string,
  ): Promise<Translation[]> {
    const translations = await Promise.all(
      words.map(word => this.generateTranslation(word, sourceLang, targetLang, category)),
    );
    return translations;
  }

  async importFromCSV(
    csvData: string,
    sourceLang: LanguageCode,
    targetLang: LanguageCode
  ): Promise<Translation[]> {
    const lines = csvData.split('\n').filter(line => line.trim());
    const translations: Translation[] = [];

    for (let i = 1; i < lines.length; i++) {
      const [sourceWord, targetWord, category] = lines[i].split(',').map(s => s.trim());
      
      if (sourceWord && targetWord) {
        translations.push({
          id: `${Date.now()}-${i}`,
          sourceWord,
          targetWord,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          status: 'pending',
          generatedBy: 'api',
          createdAt: new Date(),
          category: category || undefined,
        });
      }
    }

    return translations;
  }
}

export default new TranslationService();