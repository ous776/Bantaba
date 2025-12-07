import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SUPPORTED_LANGUAGES } from '../../src/config/languages';

export default function HomeScreen() {
  const router = useRouter();
  const localLanguages = SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'en');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bantaba</Text>
        <Text style={styles.subtitle}>West African Language Translation</Text>
        <Text style={styles.description}>
          Help build translation datasets by verifying AI-generated translations
        </Text>
      </View>

      <View style={styles.languagesSection}>
        <Text style={styles.sectionTitle}>Select a Language</Text>
        
        {localLanguages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={styles.languageCard}
            onPress={() => router.push(`/language/${language.code}`)}>
            <View style={styles.languageHeader}>
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{language.name}</Text>
                <Text style={styles.languageRegion}>{language.region}</Text>
              </View>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.statsButton}
        onPress={() => router.push('/stats')}>
        <Text style={styles.statsButtonText}>📊 View Statistics</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ecf0f1',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  languagesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  languageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 40,
    marginRight: 15,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  languageRegion: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  arrow: {
    fontSize: 24,
    color: '#3498db',
  },
  statsButton: {
    backgroundColor: '#9b59b6',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
