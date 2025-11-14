import { create } from 'zustand';
import { supabaseQueries } from './api';
import { supabase } from './supabase';

const STORAGE_KEY = 'elevai_user_profile';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedProfile {
  profile: UserProfile;
  timestamp: number;
}

// Helper functions for localStorage
const loadFromCache = (): UserProfile | null => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return null;

    const { profile, timestamp }: CachedProfile = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error loading profile from cache:', error);
    return null;
  }
};

const saveToCache = (profile: UserProfile) => {
  try {
    const cached: CachedProfile = {
      profile,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.error('Error saving profile to cache:', error);
  }
};

const clearCache = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing profile cache:', error);
  }
};

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  tokens: number;
  is_premium: boolean;
  premium_plan: string | null;
  premium_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UserStore {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;

  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateTokens: (newTokens: number) => void;
  reset: () => void;
}

// Initialize with cached data
const cachedProfile = loadFromCache();

export const useUserStore = create<UserStore>((set, get) => ({
  profile: cachedProfile,
  loading: false,
  error: null,
  hydrated: !!cachedProfile,

  fetchProfile: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const profile = await supabaseQueries.getProfile(userId);
      saveToCache(profile);
      set({ profile, loading: false, hydrated: true });
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch profile',
        loading: false,
      });
    }
  },

  refreshProfile: async () => {
    const { profile } = get();
    if (profile?.id) {
      await get().fetchProfile(profile.id);
    }
  },

  updateTokens: (newTokens: number) => {
    const { profile } = get();
    if (profile) {
      const updatedProfile = { ...profile, tokens: newTokens };
      saveToCache(updatedProfile);
      set({ profile: updatedProfile });
    }
  },

  reset: () => {
    clearCache();
    set({ profile: null, loading: false, error: null, hydrated: false });
  },
}));

// Set up real-time subscription for profile updates
export const subscribeToProfileChanges = (userId: string) => {
  const channel = supabase
    .channel('profile-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        console.log('Profile updated:', payload);
        const store = useUserStore.getState();
        if (payload.new) {
          store.fetchProfile(userId);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
