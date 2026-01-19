import AsyncStorage from '@react-native-async-storage/async-storage';
import { USE_BACKEND } from '../config/api';
import { Translation, VerificationResult } from '../types';
import ApiService from './ApiService';

class StorageService {
  private TRANSLATIONS_KEY = '@bantaba_translations';
  private VERIFICATIONS_KEY = '@bantaba_verifications';

  /**
   * Save a translation to Supabase (primary) and AsyncStorage (cache/fallback)
   */
  async saveTranslation(translation: Translation): Promise<void> {
    // Try to save to Supabase first if backend is enabled
    if (USE_BACKEND) {
      try {
        const savedTranslation = await ApiService.saveTranslation(translation);
        if (savedTranslation) {
          // Update local cache with the saved translation (using Supabase ID)
          await this.updateLocalCache(savedTranslation);
          return;
        }
      } catch (error) {
        console.warn('Failed to save translation to Supabase, saving locally:', error);
        // Fall through to local save
      }
    }

    // Fallback: Save to local storage only
    const translations = await this.getLocalTranslations();
    translations.push(translation);
    await AsyncStorage.setItem(
      this.TRANSLATIONS_KEY,
      JSON.stringify(translations),
    );
  }

  /**
   * Get translations from Supabase first, then fall back to local cache
   */
  async getTranslations(): Promise<Translation[]> {
    if (USE_BACKEND) {
      try {
        // For now, return local cache. In the future, you might want to sync from Supabase
        // This keeps the existing behavior while using Supabase for writes
        return await this.getLocalTranslations();
      } catch (error) {
        console.warn('Failed to get translations from Supabase, using local cache:', error);
      }
    }

    return await this.getLocalTranslations();
  }

  /**
   * Get translations by language from Supabase
   */
  async getTranslationsByLanguage(languageCode: string, limit: number = 100): Promise<Translation[]> {
    if (USE_BACKEND) {
      try {
        return await ApiService.getTranslationsByLanguage(languageCode as any, limit);
      } catch (error) {
        console.warn('Failed to get translations from Supabase, using local cache:', error);
      }
    }

    const localTranslations = await this.getLocalTranslations();
    return localTranslations
      .filter(t => t.targetLanguage === languageCode)
      .slice(0, limit);
  }

  /**
   * Save verification result and update translation status
   */
  async saveVerification(verification: VerificationResult): Promise<void> {
    // Save verification locally
    const verifications = await this.getVerifications();
    verifications.push(verification);
    await AsyncStorage.setItem(
      this.VERIFICATIONS_KEY,
      JSON.stringify(verifications),
    );

    // Prepare translation update for Supabase (only targetWord if corrected)
    const supabaseUpdate: Partial<Translation> = {};
    if (verification.correctedWord) {
      supabaseUpdate.targetWord = verification.correctedWord;
    }

    // Update in Supabase if backend is enabled (only update targetWord, not status/verifiedAt)
    if (USE_BACKEND && verification.correctedWord) {
      try {
        await ApiService.updateTranslation(verification.translationId, supabaseUpdate);
      } catch (error) {
        console.warn('Failed to update translation in Supabase, updating locally:', error);
      }
    }

    // For local cache, include status and verifiedAt for app functionality
    const updatedTranslation: Partial<Translation> = {
      status: verification.isCorrect ? 'verified' : 'corrected',
      verifiedAt: new Date(),
      ...supabaseUpdate,
    };

    // Update local cache
    const translations = await this.getLocalTranslations();
    const index = translations.findIndex(t => t.id === verification.translationId);
    if (index !== -1) {
      translations[index] = {
        ...translations[index],
        ...updatedTranslation,
      } as Translation;
      await AsyncStorage.setItem(
        this.TRANSLATIONS_KEY,
        JSON.stringify(translations),
      );
    }
  }

  async getVerifications(): Promise<VerificationResult[]> {
    const data = await AsyncStorage.getItem(this.VERIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  }

  async exportDataset(): Promise<{translations: Translation[]; verifications: VerificationResult[]}> {
    const translations = await this.getTranslations();
    const verifications = await this.getVerifications();
    return {translations, verifications};
  }

  // Private helper methods
  private async getLocalTranslations(): Promise<Translation[]> {
    const data = await AsyncStorage.getItem(this.TRANSLATIONS_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    // Convert date strings back to Date objects
    return parsed.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      verifiedAt: t.verifiedAt ? new Date(t.verifiedAt) : undefined,
    }));
  }

  private async updateLocalCache(translation: Translation): Promise<void> {
    const translations = await this.getLocalTranslations();
    const existingIndex = translations.findIndex(t => 
      t.id === translation.id || 
      (t.sourceWord === translation.sourceWord && t.targetLanguage === translation.targetLanguage)
    );

    if (existingIndex >= 0) {
      translations[existingIndex] = translation;
    } else {
      translations.push(translation);
    }

    await AsyncStorage.setItem(
      this.TRANSLATIONS_KEY,
      JSON.stringify(translations),
    );
  }
}

export default new StorageService();
