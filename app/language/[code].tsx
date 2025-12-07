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
import { LanguageCode } from '../../src/types';

export default function LanguageScreen() {
  const {code} = useLocalSearchParams();
  const router = useRouter();
  const language = getLanguageByCode(code as string);
  
  const [currentWord, setCurrentWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [translationId, setTranslationId] = useState('');
  const [stats, setStats] = useState({verified: 0, skipped: 0});

  useEffect(() => {
    loadNewWord();
    loadStats();
  }, []);

  const loadStats = async () => {
    const translations = await StorageService.getTranslations();
    const languageTranslations = translations.filter(
      t => t.targetLanguage === code
    );
    setStats({
      verified: languageTranslations.filter(t => t.status !== 'pending').length,
      skipped: 0,
    });
  };

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
      await StorageService.saveTranslation(translationData);
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

    await StorageService.saveVerification({
      translationId,
      isCorrect: true,
      correctedWord: translation,
      verifiedBy: 'user',
      verifiedAt: new Date(),
    });

    setStats(prev => ({...prev, verified: prev.verified + 1}));
    loadNewWord();
  };

  const handleSkip = () => {
    setStats(prev => ({...prev, skipped: prev.skipped + 1}));
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
          {language.flag} {language.name}
        </Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>✓ {stats.verified}</Text>
        </View>
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
                {language.flag} {language.name}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
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
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    color: '#7f8c8d',
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
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  sourceWord: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  arrow: {
    fontSize: 32,
    color: '#3498db',
  },
  input: {
    fontSize: 24,
    color: '#2c3e50',
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
    backgroundColor: '#95a5a6',
  },
  submitButton: {
    backgroundColor: '#27ae60',
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
    color: '#7f8c8d',
  },
});
