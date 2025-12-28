import AsyncStorage from '@react-native-async-storage/async-storage';
import { Translation, VerificationResult } from '../types';
import ApiService from './ApiService';

class StorageService {
  private TRANSLATIONS_KEY = '@bantaba_translations';
  private VERIFICATIONS_KEY = '@bantaba_verifications';

  async saveTranslation(translation: Translation): Promise<void> {
    // Save to local storage first
    const translations = await this.getTranslations();
    translations.push(translation);
    await AsyncStorage.setItem(
      this.TRANSLATIONS_KEY,
      JSON.stringify(translations),
    );

    // Try to save to backend as well
    try {
      const backendTranslation = await ApiService.saveTranslation(translation);
      if (backendTranslation) {
        // Update local storage with backend ID
        const updatedTranslations = translations.map(t => 
          t.id === translation.id ? { ...t, id: backendTranslation.id } : t
        );
        await AsyncStorage.setItem(
          this.TRANSLATIONS_KEY,
          JSON.stringify(updatedTranslations),
        );
      }
    } catch (error) {
      // Backend save failed, but local save succeeded
      console.warn('Backend save failed, continuing with local save');
    }
  }

  async getTranslations(): Promise<Translation[]> {
    const data = await AsyncStorage.getItem(this.TRANSLATIONS_KEY);
    return data ? JSON.parse(data) : [];
  }

  async saveVerification(verification: VerificationResult): Promise<void> {
    const verifications = await this.getVerifications();
    verifications.push(verification);
    await AsyncStorage.setItem(
      this.VERIFICATIONS_KEY,
      JSON.stringify(verifications),
    );

    // Update translation status locally
    const translations = await this.getTranslations();
    const index = translations.findIndex(t => t.id === verification.translationId);
    if (index !== -1) {
      const updatedTranslation = {
        ...translations[index],
        status: verification.isCorrect ? 'verified' : 'corrected',
        verifiedAt: new Date(),
      };
      
      if (verification.correctedWord) {
        updatedTranslation.targetWord = verification.correctedWord;
      }
      
      translations[index] = updatedTranslation;
      await AsyncStorage.setItem(
        this.TRANSLATIONS_KEY,
        JSON.stringify(translations),
      );

      // Try to update backend as well
      try {
        await ApiService.updateTranslation(verification.translationId, updatedTranslation);
      } catch (error) {
        // Backend update failed, but local save succeeded
        console.warn('Backend update failed, continuing with local save');
      }
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
}

export default new StorageService();
