import { useMemo } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useUserStore } from '@/lib/user-store';

/**
 * Hook to get user information in a consistent way
 * Memoized to prevent unnecessary re-computations
 */
export function useUserInfo() {
  const { user } = useAuthStore();
  const { profile } = useUserStore();

  const username = useMemo(() => {
    const fullName = user?.user_metadata?.full_name;
    if (fullName) {
      return fullName.split(' ')[0]; // Take only first word
    }
    return user?.email?.split('@')[0] || 'User';
  }, [user?.user_metadata?.full_name, user?.email]);

  const isPremium = useMemo(() => {
    return (
      profile?.is_premium &&
      (!profile.premium_expires_at ||
        new Date(profile.premium_expires_at) > new Date())
    );
  }, [profile?.is_premium, profile?.premium_expires_at]);

  const tokens = profile?.tokens || 0;

  return {
    user,
    profile,
    username,
    isPremium,
    tokens,
  };
}
