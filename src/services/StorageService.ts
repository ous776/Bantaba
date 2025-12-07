import AsyncStorage from '@react-native-async-storage/async-storage';
import { Translation, VerificationResult } from '../types';

class StorageService {
  private TRANSLATIONS_KEY = '@bantaba_translations';
  private VERIFICATIONS_KEY = '@bantaba_verifications';

  async saveTranslation(translation: Translation): Promise<void> {
    const translations = await this.getTranslations();
    translations.push(translation);
    await AsyncStorage.setItem(
      this.TRANSLATIONS_KEY,
      JSON.stringify(translations),
    );
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

    // Update translation status
    const translations = await this.getTranslations();
    const index = translations.findIndex(t => t.id === verification.translationId);
    if (index !== -1) {
      translations[index].status = verification.isCorrect ? 'verified' : 'corrected';
      translations[index].verifiedAt = new Date();
      if (verification.correctedWord) {
        translations[index].targetWord = verification.correctedWord;
      }
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
}

export default new StorageService();
