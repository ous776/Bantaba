import { supabase, USE_BACKEND } from '../config/api';
import { LanguageCode, Translation, User, UserContribution } from '../types';

// Helper function to convert Supabase row to Translation
function supabaseRowToTranslation(row: any, targetLanguage: LanguageCode): Translation {
  return {
    id: row.id.toString(),
    sourceWord: row.english_word,
    targetWord: row.translated_word,
    sourceLanguage: 'en' as LanguageCode,
    targetLanguage: targetLanguage,
    status: 'pending', // Default value since column doesn't exist in DB
    generatedBy: 'api', // Default value since column doesn't exist in DB
    createdAt: new Date(row.created_at),
    verifiedAt: undefined, // Column doesn't exist in DB
    category: undefined, // Column doesn't exist in DB
    // Note: status, category, verified_at, difficulty, and audioUrl not stored in DB
  };
}

// Helper function to convert Translation to Supabase insert/update format
function translationToSupabaseRow(translation: Translation): any {
  return {
    english_word: translation.sourceWord,
    language_code: translation.targetLanguage,
    translated_word: translation.targetWord,
    // Note: status, category, verified_at, difficulty, generated_by, and audio_url columns don't exist in DB
  };
}

class ApiService {
  constructor() {
    // Debug: log whether backend usage is enabled
    // eslint-disable-next-line no-console
    console.debug('ApiService initialized with Supabase. USE_BACKEND=', USE_BACKEND);
  }

  async saveTranslation(translation: Translation): Promise<Translation | null> {
    if (!USE_BACKEND) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('translations')
        .insert(translationToSupabaseRow(translation))
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from Supabase');
      }

      // Return the translation with backend ID
      return supabaseRowToTranslation(data, translation.targetLanguage);
    } catch (error) {
      console.error('Failed to save translation to Supabase:', error);
      throw error;
    }
  }

  async updateTranslation(id: string, updates: Partial<Translation>): Promise<Translation | null> {
    if (!USE_BACKEND) {
      return null;
    }

    try {
      const updateData: any = {};
      
      if (updates.targetWord !== undefined) {
        updateData.translated_word = updates.targetWord;
      }
      // Note: status, category, verified_at, difficulty, and audioUrl columns don't exist in DB

      const { data, error } = await supabase
        .from('translations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from Supabase');
      }

      // Get the language code from the existing translation
      const targetLanguage = data.language_code as LanguageCode;
      return supabaseRowToTranslation(data, targetLanguage);
    } catch (error) {
      console.error('Failed to update translation in Supabase:', error);
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
      let supabaseQuery = supabase
        .from('translations')
        .select('*')
        .eq('language_code', languageCode)
        .limit(limit)
        .order('created_at', { ascending: false });

      // If query provided, search in english_word and translated_word
      if (query) {
        supabaseQuery = supabaseQuery.or(
          `english_word.ilike.%${query}%,translated_word.ilike.%${query}%`
        );
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        throw error;
      }

      if (!data) {
        return [];
      }

      // Convert Supabase rows to Translation format
      return data.map((row: any) => supabaseRowToTranslation(row, languageCode));
    } catch (error) {
      console.error('Failed to search translations from Supabase:', error);
      return [];
    }
  }

  // Get a single translation by ID
  async getTranslation(id: string): Promise<Translation | null> {
    if (!USE_BACKEND) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      const targetLanguage = data.language_code as LanguageCode;
      return supabaseRowToTranslation(data, targetLanguage);
    } catch (error) {
      console.error('Failed to get translation from Supabase:', error);
      return null;
    }
  }

  // Get all translations for a language
  async getTranslationsByLanguage(
    languageCode: LanguageCode,
    limit: number = 100
  ): Promise<Translation[]> {
    if (!USE_BACKEND) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('language_code', languageCode)
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!data) {
        return [];
      }

      return data.map((row: any) => supabaseRowToTranslation(row, languageCode));
    } catch (error) {
      console.error('Failed to get translations from Supabase:', error);
      return [];
    }
  }

  // User-related methods
  async saveUser(user: User): Promise<User | null> {
    if (!USE_BACKEND) {
      return null;
    }

    try {
      const userRow = {
        id: user.id,
        name: user.name || null,
        email: user.email || null,
        phone: user.phone || null,
        city: user.city || null,
        is_anonymous: user.isAnonymous,
        contribution_count: user.contributionCount,
        created_at: user.createdAt.toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Use upsert to insert or update
      const { data, error } = await supabase
        .from('users')
        .upsert(userRow, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from Supabase');
      }

      return {
        id: data.id,
        name: data.name || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        city: data.city || undefined,
        isAnonymous: data.is_anonymous,
        createdAt: new Date(data.created_at),
        contributionCount: data.contribution_count,
      };
    } catch (error) {
      console.error('Failed to save user to Supabase:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    if (!USE_BACKEND) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        name: data.name || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        city: data.city || undefined,
        isAnonymous: data.is_anonymous,
        createdAt: new Date(data.created_at),
        contributionCount: data.contribution_count,
      };
    } catch (error) {
      console.error('Failed to get user from Supabase:', error);
      return null;
    }
  }

  async saveUserContribution(contribution: UserContribution): Promise<UserContribution | null> {
    if (!USE_BACKEND) {
      return null;
    }

    try {
      const contributionRow = {
        id: contribution.id,
        user_id: contribution.userId,
        translation_id: contribution.translationId,
        action: contribution.action,
        language_code: contribution.languageCode,
        timestamp: contribution.timestamp.toISOString(),
      };

      const { data, error } = await supabase
        .from('user_contributions')
        .insert(contributionRow)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from Supabase');
      }

      return {
        id: data.id,
        userId: data.user_id,
        translationId: data.translation_id,
        action: data.action as 'verified' | 'corrected' | 'skipped',
        languageCode: data.language_code,
        timestamp: new Date(data.timestamp),
      };
    } catch (error) {
      console.error('Failed to save user contribution to Supabase:', error);
      throw error;
    }
  }

  async updateUserContributionCount(userId: string, newCount: number): Promise<void> {
    if (!USE_BACKEND) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ contribution_count: newCount, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to update user contribution count in Supabase:', error);
      throw error;
    }
  }
}

export default new ApiService();