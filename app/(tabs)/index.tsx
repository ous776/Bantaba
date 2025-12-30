import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SUPPORTED_LANGUAGES } from '../../src/config/languages';

export default function HomeScreen() {
  const router = useRouter();
  const localLanguages = SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'en');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
            <View style={styles.brand}>
             
              <Text style={styles.title}>Bantaba</Text>
            </View>
            <View style={styles.brand}>
              <Image source={require('../../assets/images/icon01.png')} style={styles.headerIcon} />
            </View>
          </View>

        <Text style={styles.subtitle}>Local Language Translation</Text>
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
              <Text style={styles.languageFlag}>🌍</Text>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{language.name}</Text>
                <Text style={styles.languageNative}>{language.nativeName}</Text>
              </View>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          More languages coming soon: Wolof, Fula, and Jola
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#27ae60', // Primary green
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: 'rgba(255,255,255,0.15)'
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#e8f5e8',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#d4edda',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  searchBar: {
    marginTop: 14,
    width: '90%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  searchText: {
    color: '#6c757d',
    fontSize: 15,
  },
  languagesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513', // Primary brown
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
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60', // Green accent
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
    color: '#8B4513', // Brown text
    marginBottom: 5,
  },
  languageNative: {
    fontSize: 14,
    color: '#6c757d',
  },
  arrow: {
    fontSize: 24,
    color: '#27ae60', // Green arrow
  },
  infoSection: {
    margin: 20,
    padding: 15,
    backgroundColor: '#d1cecbff', // Light brown
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    //color: '#8B4513', // Dark brown text
    fontSize: 14,
    fontStyle: 'italic',
  },
});
