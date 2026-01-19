import AsyncStorage from '@react-native-async-storage/async-storage';
import { USE_BACKEND } from '../config/api';
import { User, UserContribution } from '../types';
import ApiService from './ApiService';

class UserService {
  private USER_KEY = '@bantaba_user';
  private ONBOARDING_COMPLETE_KEY = '@bantaba_onboarding_complete';
  private CONTRIBUTIONS_KEY = '@bantaba_contributions';

  /**
   * Check if onboarding has been completed
   */
  async isOnboardingComplete(): Promise<boolean> {
    const value = await AsyncStorage.getItem(this.ONBOARDING_COMPLETE_KEY);
    return value === 'true';
  }

  /**
   * Mark onboarding as complete
   */
  async setOnboardingComplete(): Promise<void> {
    await AsyncStorage.setItem(this.ONBOARDING_COMPLETE_KEY, 'true');
  }

  /**
   * Get current user
   */
  async getUser(): Promise<User | null> {
    // Try to get from local storage first (for quick access)
    const localData = await AsyncStorage.getItem(this.USER_KEY);
    if (localData) {
      const parsed = JSON.parse(localData);
      const localUser: User = {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
      };

      // If backend is enabled, try to sync with Supabase
      if (USE_BACKEND) {
        try {
          const dbUser = await ApiService.getUser(localUser.id);
          if (dbUser) {
            // Update local cache with DB data
            await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(dbUser));
            return dbUser;
          }
        } catch (error) {
          console.warn('Failed to get user from Supabase, using local cache:', error);
        }
      }

      return localUser;
    }

    return null;
  }

  /**
   * Save or update user
   */
  async saveUser(user: Partial<User> & { isAnonymous: boolean }): Promise<User> {
    const existingUser = await this.getUser();
    const userId = existingUser?.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newUser: User = {
      id: userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      isAnonymous: user.isAnonymous,
      createdAt: existingUser?.createdAt || new Date(),
      contributionCount: existingUser?.contributionCount || 0,
    };

    // Try to save to Supabase first if backend is enabled
    if (USE_BACKEND) {
      try {
        const savedUser = await ApiService.saveUser(newUser);
        if (savedUser) {
          // Update local cache with the saved user
          await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(savedUser));
          return savedUser;
        }
      } catch (error) {
        console.warn('Failed to save user to Supabase, saving locally:', error);
        // Fall through to local save
      }
    }

    // Fallback: Save to local storage only
    await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(newUser));
    return newUser;
  }

  /**
   * Save user as anonymous contributor
   */
  async saveAnonymousUser(): Promise<User> {
    return await this.saveUser({name: 'Anonymous', isAnonymous: true });
  }

  /**
   * Track a user contribution
   */
  async trackContribution(
    translationId: string,
    action: 'verified' | 'corrected' | 'skipped',
    languageCode: string
  ): Promise<void> {
    const user = await this.getUser();
    if (!user) {
      console.warn('Cannot track contribution: No user found');
      return;
    }

    const contribution: UserContribution = {
      id: `contrib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      translationId,
      action,
      languageCode,
      timestamp: new Date(),
    };

    // Try to save to Supabase first if backend is enabled
    if (USE_BACKEND) {
      try {
        await ApiService.saveUserContribution(contribution);
      } catch (error) {
        console.warn('Failed to save contribution to Supabase, saving locally:', error);
        // Fall through to local save
      }
    }

    // Save contribution locally (for cache/fallback)
    const contributions = await this.getContributions();
    contributions.push(contribution);
    await AsyncStorage.setItem(
      this.CONTRIBUTIONS_KEY,
      JSON.stringify(contributions),
    );

    // Update user contribution count (only count verified/corrected, not skipped)
    if (action !== 'skipped') {
      const newCount = user.contributionCount + 1;
      const updatedUser: User = {
        ...user,
        contributionCount: newCount,
      };

      // Update in Supabase if backend is enabled
      if (USE_BACKEND) {
        try {
          await ApiService.updateUserContributionCount(user.id, newCount);
        } catch (error) {
          console.warn('Failed to update contribution count in Supabase:', error);
        }
      }

      // Update local cache
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    }
  }

  /**
   * Get all contributions for current user
   */
  async getContributions(): Promise<UserContribution[]> {
    const data = await AsyncStorage.getItem(this.CONTRIBUTIONS_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.map((c: any) => ({
      ...c,
      timestamp: new Date(c.timestamp),
    }));
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    totalContributions: number;
    verified: number;
    corrected: number;
    skipped: number;
    byLanguage: Record<string, number>;
  }> {
    const contributions = await this.getContributions();
    const user = await this.getUser();
    
    if (!user) {
      return {
        totalContributions: 0,
        verified: 0,
        corrected: 0,
        skipped: 0,
        byLanguage: {},
      };
    }

    const userContributions = contributions.filter(c => c.userId === user.id);
    
    const stats = {
      totalContributions: userContributions.length,
      verified: userContributions.filter(c => c.action === 'verified').length,
      corrected: userContributions.filter(c => c.action === 'corrected').length,
      skipped: userContributions.filter(c => c.action === 'skipped').length,
      byLanguage: {} as Record<string, number>,
    };

    userContributions.forEach(c => {
      stats.byLanguage[c.languageCode] = (stats.byLanguage[c.languageCode] || 0) + 1;
    });

    return stats;
  }
}

export default new UserService();
