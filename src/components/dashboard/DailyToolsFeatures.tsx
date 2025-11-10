import { FeatureCard } from "./FeatureCard";
import { Video, Sparkles } from "lucide-react";

interface FeaturesProps {
  searchQuery: string;
  isPremium: boolean;
  onFeatureClick: (id: string, isPremium: boolean) => void;
}

const features = [
  {
    id: "veo-prompting",
    icon: Video,
    title: "VEO 3 Prompting",
    description: "Generator prompt untuk membuat video dengan AI seperti Google Veo.",
    isPremium: false,
  },
  {
    id: "prompt-enhancer",
    icon: Sparkles,
    title: "Prompt Enhancer",
    description: "Upgrade prompt dasar Anda menjadi prompt canggih.",
    isPremium: false,
  },
];

export const DailyToolsFeatures = ({ searchQuery, isPremium, onFeatureClick }: FeaturesProps) => {
  const filteredFeatures = features.filter((feature) =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Daily Tools</h2>
        <p className="text-muted-foreground">Peralatan harian untuk membantu produktivitas dan kreativitas Anda.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            isPremium={feature.isPremium}
            isUserPremium={isPremium}
            onClick={() => onFeatureClick(feature.id, feature.isPremium)}
          />
        ))}
      </div>
    </div>
  );
};
