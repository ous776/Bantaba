import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getLanguageByCode } from '../../src/config/languages';
import StorageService from '../../src/services/StorageService';
import TranslationService from '../../src/services/TranslationService';
import UserService from '../../src/services/UserService';
import { LanguageCode } from '../../src/types';

export default function LanguageScreen() {
  const {code} = useLocalSearchParams();
  const router = useRouter();
  const language = getLanguageByCode(code as string);
  
  const [currentWord, setCurrentWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [translationId, setTranslationId] = useState('');

  useEffect(() => {
    loadNewWord();
  }, []);

  const getRandomWord = (): string => {
    // Get random word from the language's JSON data
    return TranslationService.getRandomEnglishWord(code as LanguageCode);
  };

  const loadNewWord = async () => {
    setIsLoading(true);
    const word = getRandomWord();
    setCurrentWord(word);

    try {
      console.log('Loading new word:', word);
      const translationData = await TranslationService.generateTranslation(
        word,
        'en',
        code as LanguageCode,
      );
      console.log('Translation received:', translationData.targetWord);
      setTranslation(translationData.targetWord);
      setTranslationId(translationData.id);
      // Don't save to DB on load - only save when user submits
    } catch (error) {
      console.error('Error loading word:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to load translation';
      
      Alert.alert(
        'Translation Lookup',
        errorMessage + '\n\nYou can enter the translation manually.',
        [
          {text: 'Try Another Word', onPress: () => loadNewWord()},
          {text: 'Enter Manually', style: 'cancel'},
        ]
      );
      setTranslation('');
      setTranslationId(`${Date.now()}-manual`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!translation.trim()) {
      Alert.alert('Error', 'Please enter a translation');
      return;
    }

    try {
      // First, get the original translation data
      const translationData = await TranslationService.generateTranslation(
        currentWord,
        'en',
        code as LanguageCode,
      );
      const originalTranslation = translationData.targetWord;
      const wasCorrected = translation.trim() !== originalTranslation.trim();
      
      // Use the user's translation (may be corrected)
      translationData.targetWord = translation;
      await StorageService.saveTranslation(translationData);

      // Then save the verification
      await StorageService.saveVerification({
        translationId: translationData.id,
        isCorrect: !wasCorrected,
        correctedWord: wasCorrected ? translation : undefined,
        verifiedBy: 'user',
        verifiedAt: new Date(),
      });

      // Track user contribution
      const action = wasCorrected ? 'corrected' : 'verified';
      await UserService.trackContribution(
        translationData.id,
        action,
        code as string
      );

      console.log('✅ Translation and verification saved successfully');
      loadNewWord();
    } catch (error) {
      console.error('❌ Error saving translation:', error);
      Alert.alert('Error', 'Failed to save translation. Please try again.');
    }
  };

  const handleSkip = async () => {
    // Track skipped contribution
    if (translationId) {
      try {
        await UserService.trackContribution(
          translationId,
          'skipped',
          code as string
        );
      } catch (error) {
        console.warn('Failed to track skipped contribution:', error);
      }
    }
    loadNewWord();
  };

  if (!language) {
    return (
      <View style={styles.container}>
        <Text>Language not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.languageTitle}>
          🌍 {language.name}
        </Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading translation...</Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>🇬🇧 English</Text>
              <Text style={styles.sourceWord}>{currentWord}</Text>
            </View>

            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>↓</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>
                 {language.name}
              </Text>
              <TextInput
                style={styles.input}
                value={translation}
                onChangeText={setTranslation}
                placeholder={`Enter ${language.name} translation`}
                multiline
                autoFocus
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.skipButton]}
                onPress={handleSkip}>
                <Text style={styles.buttonText}>Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit ✓</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.hint}>
              Edit the translation if needed, then submit or skip
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#14743cff', // Primary green
    padding: 30,
    paddingTop: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  languageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 50, // Same width as back button for centering
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#8B4513', // Brown text
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60', // Green accent
  },
  label: {
    fontSize: 14,
    color: '#8B4513', // Brown text
    marginBottom: 10,
    fontWeight: '600',
  },
  sourceWord: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513', // Brown text
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  arrow: {
    fontSize: 32,
    color: '#27ae60', // Green arrow
  },
  input: {
    fontSize: 24,
    color: '#8B4513', // Brown text
    minHeight: 60,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#D2B48C', // Light brown
  },
  submitButton: {
    backgroundColor: '#27ae60', // Primary green
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#8B4513', // Brown text
  },
});
