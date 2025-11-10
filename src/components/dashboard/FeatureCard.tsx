import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

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
  // Allow all features to be clickable for now
  const isDisabled = false;

  return (
    <Card
      className={`p-6 gradient-card border-border/50 transition-smooth group cursor-pointer ${
        isDisabled
          ? 'opacity-50 cursor-not-allowed hover:border-border/50'
          : 'hover:border-primary/50 hover:shadow-glow'
      }`}
      onClick={!isDisabled ? onClick : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <Icon
          className={`w-10 h-10 ${
            isDisabled
              ? 'text-muted-foreground'
              : 'text-primary group-hover:scale-110 transition-smooth'
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
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
};
