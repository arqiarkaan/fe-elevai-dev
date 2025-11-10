import { FeatureCard } from "./FeatureCard";
import { FileCheck } from "lucide-react";

interface FeaturesProps {
  searchQuery: string;
  isPremium: boolean;
  onFeatureClick: (id: string, isPremium: boolean) => void;
}

const features = [
  {
    id: "kti-reviewer",
    icon: FileCheck,
    title: "KTI Reviewer by ElevatEd",
    description: "Nilai PDF KTI otomatis beserta rubrik dan laporan siap unduh.",
    isPremium: true,
  },
];

export const ReviewerFeatures = ({ searchQuery, isPremium, onFeatureClick }: FeaturesProps) => {
  const filteredFeatures = features.filter((feature) =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Reviewer</h2>
        <p className="text-muted-foreground">Penilaian KTI dan karya ilmiah secara instan.</p>
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
