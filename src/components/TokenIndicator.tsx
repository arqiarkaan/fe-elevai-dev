import { Coins, Loader2 } from 'lucide-react';
import { useFeatureTokenCost } from '@/hooks/useFeatureTokens';

interface TokenIndicatorProps {
  featureId: string;
  className?: string;
}

export const TokenIndicator = ({
  featureId,
  className = '',
}: TokenIndicatorProps) => {
  const { tokenCost, isLoading } = useFeatureTokenCost(featureId);

  if (isLoading) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 ${className}`}
      >
        <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
        <span className="text-sm text-muted-foreground">Memuat...</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 ${className}`}
    >
      <Coins className="w-4 h-4 text-yellow-500 flex-shrink-0" />
      <span className="text-sm font-medium">
        Membutuhkan{' '}
        <span className="font-bold text-yellow-600 dark:text-yellow-400">
          {tokenCost} token
        </span>
      </span>
    </div>
  );
};
