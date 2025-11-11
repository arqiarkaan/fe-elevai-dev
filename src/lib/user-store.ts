import { create } from 'zustand';
import { supabaseQueries } from './api';
import { supabase } from './supabase';

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
  
  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateTokens: (newTokens: number) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const profile = await supabaseQueries.getProfile(userId);
      set({ profile, loading: false });
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
        loading: false 
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
      set({ profile: { ...profile, tokens: newTokens } });
    }
  },

  reset: () => {
    set({ profile: null, loading: false, error: null });
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
