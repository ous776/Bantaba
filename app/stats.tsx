import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SUPPORTED_LANGUAGES } from '../src/config/languages';
import StorageService from '../src/services/StorageService';

export default function StatsScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<Record<string, any>>({});
  const [totalStats, setTotalStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    corrected: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const translations = await StorageService.getTranslations();
    
    // Overall stats
    setTotalStats({
      total: translations.length,
      verified: translations.filter(t => t.status === 'verified').length,
      pending: translations.filter(t => t.status === 'pending').length,
      corrected: translations.filter(t => t.status === 'corrected').length,
    });

    // Per-language stats
    const languageStats: Record<string, any> = {};
    const localLanguages = SUPPORTED_LANGUAGES.filter(l => l.code !== 'en');
    
    localLanguages.forEach(lang => {
      const langTranslations = translations.filter(
        t => t.targetLanguage === lang.code
      );
      languageStats[lang.code] = {
        name: lang.name,
        flag: lang.flag,
        total: langTranslations.length,
        verified: langTranslations.filter(t => t.status === 'verified').length,
        pending: langTranslations.filter(t => t.status === 'pending').length,
        corrected: langTranslations.filter(t => t.status === 'corrected').length,
      };
    });

    setStats(languageStats);
  };

  const handleExport = async () => {
    const dataset = await StorageService.exportDataset();
    console.log('Dataset Export:', JSON.stringify(dataset, null, 2));
    Alert.alert(
      'Export Complete',
      `Exported ${dataset.translations.length} translations\nCheck console for full data`,
      [
        {text: 'OK'},
        {
          text: 'Copy Summary',
          onPress: () => {
            // In a real app, you'd use Clipboard API here
            console.log('Summary:', {
              totalTranslations: dataset.translations.length,
              totalVerifications: dataset.verifications.length,
              byLanguage: stats,
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Statistics</Text>
        <View style={{width: 50}} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalStats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, {color: '#27ae60'}]}>
              {totalStats.verified}
            </Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, {color: '#f39c12'}]}>
              {totalStats.corrected}
            </Text>
            <Text style={styles.statLabel}>Corrected</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, {color: '#95a5a6'}]}>
              {totalStats.pending}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Language</Text>
        {Object.entries(stats).map(([code, data]: [string, any]) => (
          <View key={code} style={styles.languageCard}>
            <View style={styles.languageHeader}>
              <Text style={styles.languageFlag}>{data.flag}</Text>
              <Text style={styles.languageName}>{data.name}</Text>
            </View>
            <View style={styles.languageStats}>
              <View style={styles.miniStat}>
                <Text style={styles.miniStatValue}>{data.total}</Text>
                <Text style={styles.miniStatLabel}>Total</Text>
              </View>
              <View style={styles.miniStat}>
                <Text style={[styles.miniStatValue, {color: '#27ae60'}]}>
                  {data.verified}
                </Text>
                <Text style={styles.miniStatLabel}>Verified</Text>
              </View>
              <View style={styles.miniStat}>
                <Text style={[styles.miniStatValue, {color: '#f39c12'}]}>
                  {data.corrected}
                </Text>
                <Text style={styles.miniStatLabel}>Corrected</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
        <Text style={styles.exportButtonText}>📤 Export Dataset</Text>
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
    backgroundColor: '#9b59b6',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  languageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 10,
  },
  languageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  languageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  miniStatLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  exportButton: {
    backgroundColor: '#3498db',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
