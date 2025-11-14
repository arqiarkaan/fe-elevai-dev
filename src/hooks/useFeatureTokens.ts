import { useQuery } from '@tanstack/react-query';
import { featuresApi } from '@/lib/api';

interface Feature {
  id: string;
  name: string;
  category: string;
  description: string;
  isPremium: boolean;
  tokenCost: number;
  endpoint: string;
}

interface FeaturesResponse {
  success: boolean;
  data: Feature[];
}

/**
 * Hook to fetch and cache features data with token costs
 */
export function useFeatureTokens() {
  return useQuery<FeaturesResponse>({
    queryKey: ['features'],
    queryFn: () => featuresApi.getFeatures(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });
}

/**
 * Hook to get token cost for a specific feature
 */
export function useFeatureTokenCost(featureId: string) {
  const { data, isLoading } = useFeatureTokens();

  const feature = data?.data?.find((f) => f.id === featureId);

  return {
    tokenCost: feature?.tokenCost ?? 0,
    isPremium: feature?.isPremium ?? false,
    isLoading,
    feature,
  };
}
