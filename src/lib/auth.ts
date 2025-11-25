import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/lib/user-store';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  authSubscription: { unsubscribe: () => void } | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  cleanup: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,
  authSubscription: null,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (loading) => set({ loading }),

  signOut: async () => {
    // Cleanup subscription before signing out
    const state = get();
    if (state.authSubscription) {
      state.authSubscription.unsubscribe();
    }

    set({ loading: true });

    // Reset user profile store (clear tokens, premium status, etc.)
    useUserStore.getState().reset();

    await supabase.auth.signOut();
    set({ user: null, session: null, loading: false, authSubscription: null });
  },

  initialize: async () => {
    try {
      set({ loading: true });

      // Cleanup any existing subscription
      const state = get();
      if (state.authSubscription) {
        state.authSubscription.unsubscribe();
      }

      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      set({
        session,
        user: session?.user ?? null,
        loading: false,
        initialized: true,
      });

      // Listen for auth changes and store the subscription
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          loading: false,
        });
      });

      // Store subscription for cleanup
      set({ authSubscription: subscription });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false, initialized: true });
    }
  },

  cleanup: () => {
    const state = get();
    if (state.authSubscription) {
      state.authSubscription.unsubscribe();
      set({ authSubscription: null });
    }
  },
}));
