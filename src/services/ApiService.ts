import { Translation, VerificationResult, LanguageCode } from '../types';
import { API_BASE_URL, USE_BACKEND } from '../config/api';

class ApiService {
  private baseUrl = API_BASE_URL;

  async saveTranslation(translation: Translation): Promise<Translation | null> {
    if (!USE_BACKEND) {
      return null;
    }

    try {
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const savedTranslation = await response.json();
      
      // Return the translation with backend ID
      return {
        ...translation,
        id: savedTranslation.id.toString(),
      };
    } catch (error) {
      console.error('Failed to save translation to backend:', error);
      throw error;
    }
  }

  async updateTranslation(id: string, updates: Partial<Translation>): Promise<Translation | null> {
    if (!USE_BACKEND) {
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
      return updatedTranslation;
    } catch (error) {
      console.error('Failed to update translation in backend:', error);
      throw error;
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