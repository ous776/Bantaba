import { Translation, VerificationResult, LanguageCode } from '../types';
import { API_BASE_URL, USE_BACKEND } from '../config/api';

class ApiService {
  private baseUrl = API_BASE_URL;

  async saveTranslation(translation: Translation): Promise<Translation | null> {
    console.log('=== API SERVICE DEBUG ===');
    console.log('USE_BACKEND:', USE_BACKEND);
    console.log('API_BASE_URL:', this.baseUrl);
    
    if (!USE_BACKEND) {
      console.log('❌ Backend disabled, skipping API save');
      return null;
    }

    try {
      console.log('🔄 Saving translation to backend:', translation);
      const response = await fetch(`${this.baseUrl}/translations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          english_word: translation.sourceWord,
          language_code: translation.targetLanguage,
          translated_word: translation.targetWord,
          category: translation.category,
          difficulty: translation.difficulty,
        }),
      });

      console.log('📡 Backend response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const savedTranslation = await response.json();
      console.log('✅ Translation saved to backend:', savedTranslation);
      
      // Return the translation with backend ID
      return {
        ...translation,
        id: savedTranslation.id.toString(),
      };
    } catch (error) {
      console.error('❌ Failed to save translation to backend:', error);
      throw error;
    }
  }

  async updateTranslation(id: string, updates: Partial<Translation>): Promise<Translation | null> {
    if (!USE_BACKEND) {
      console.log('Backend disabled, skipping API update');
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/translations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          translated_word: updates.targetWord,
          category: updates.category,
          difficulty: updates.difficulty,
          status: updates.status,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTranslation = await response.json();
      console.log('Translation updated in backend:', updatedTranslation);
      return updatedTranslation;
    } catch (error) {
      console.error('Failed to update translation in backend:', error);
      throw error;
    }
  }

  async getRandomTranslation(languageCode: LanguageCode): Promise<Translation | null> {
    if (!USE_BACKEND) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/translations/random/${languageCode}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No random translations available from backend');
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Convert backend format to app format
      return {
        id: data.id.toString(),
        sourceWord: data.english_word,
        targetWord: data.translated_word,
        sourceLanguage: 'en' as LanguageCode,
        targetLanguage: languageCode,
        status: data.status || 'pending',
        generatedBy: 'api',
        createdAt: new Date(),
        category: data.category,
        difficulty: data.difficulty,
      };
    } catch (error) {
      console.error('Failed to get random translation from backend:', error);
      return null;
    }
  }

  async searchTranslations(
    languageCode: LanguageCode, 
    query?: string, 
    limit: number = 50
  ): Promise<Translation[]> {
    if (!USE_BACKEND) {
      return [];
    }

    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      params.append('limit', limit.toString());

      const response = await fetch(
        `${this.baseUrl}/translations/search/${languageCode}?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Convert backend format to app format
      return data.map((item: any) => ({
        id: item.id.toString(),
        sourceWord: item.english_word,
        targetWord: item.translated_word,
        sourceLanguage: 'en' as LanguageCode,
        targetLanguage: languageCode,
        status: item.status || 'pending',
        generatedBy: 'api',
        createdAt: new Date(item.created_at),
        category: item.category,
        difficulty: item.difficulty,
      }));
    } catch (error) {
      console.error('Failed to search translations from backend:', error);
      return [];
    }
  }
}

export default new ApiService();