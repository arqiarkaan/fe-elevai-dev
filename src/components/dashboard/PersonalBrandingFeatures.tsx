import { FeatureCard } from "./FeatureCard";
import { Instagram, Linkedin } from "lucide-react";

interface FeaturesProps {
  searchQuery: string;
  isPremium: boolean;
  onFeatureClick: (id: string, isPremium: boolean) => void;
}

const features = [
  {
    id: "instagram-bio",
    icon: Instagram,
    title: "Instagram Bio Analyzer",
    description: "Optimalkan bio IG kamu sesuai gaya dan keahlian.",
    isPremium: true,
  },
  {
    id: "linkedin-optimizer",
    icon: Linkedin,
    title: "LinkedIn Profile Optimizer",
    description: "Buat Headline & Summary LinkedIn profesional dengan AI.",
    isPremium: true,
  },
];

export const PersonalBrandingFeatures = ({ searchQuery, isPremium, onFeatureClick }: FeaturesProps) => {
  const filteredFeatures = features.filter((feature) =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Personal Branding</h2>
        <p className="text-muted-foreground">Tingkatkan citra dirimu dengan tools AI untuk branding profesional.</p>
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
