import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Lock } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isPremium: boolean;
  isUserPremium: boolean;
  onClick: () => void;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  isPremium,
  isUserPremium,
  onClick,
}: FeatureCardProps) => {
  // Disable premium features for non-premium users
  const isDisabled = isPremium && !isUserPremium;

  return (
    <Card
      className={`p-6 gradient-card border-border/50 transition-smooth group relative cursor-pointer hover:border-primary/50 hover:shadow-glow min-h-[200px] flex flex-col ${
        isDisabled ? 'opacity-60' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <Icon
          className={`w-12 h-12 text-primary transition-smooth ${
            !isDisabled && 'group-hover:scale-110'
          }`}
        />
        {isPremium ? (
          <Badge
            variant="outline"
            className="gradient-primary text-primary-foreground border-0"
          >
            Premium
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-400 border-green-500/30"
          >
            Gratis
          </Badge>
        )}
      </div>
      
      <div className="flex-1 pb-8">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      
      {/* Premium label at bottom for locked features */}
      {isDisabled && (
        <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground px-4 py-2 flex items-center justify-center gap-2 rounded-b-lg">
          <Lock className="w-4 h-4" />
          <span className="text-sm font-semibold">Khusus Premium</span>
        </div>
      )}
    </Card>
  );
};
