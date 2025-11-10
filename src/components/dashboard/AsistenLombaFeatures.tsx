import { FeatureCard } from './FeatureCard';
import { FileText, Microscope, Briefcase, Bot } from 'lucide-react';

interface FeaturesProps {
  searchQuery: string;
  isPremium: boolean;
  onFeatureClick: (id: string, isPremium: boolean) => void;
}

const features = [
  {
    id: 'essay-generator',
    icon: FileText,
    title: 'Essay Generator',
    description: 'Buat ide judul essay inovatif dan kreatif.',
    isPremium: false,
  },
  {
    id: 'kti-generator',
    icon: Microscope,
    title: 'KTI Generator',
    description: 'Kembangkan ide Karya Tulis Ilmiah kompetitif.',
    isPremium: false,
  },
  {
    id: 'business-plan',
    icon: Briefcase,
    title: 'Business Plan Generator',
    description: 'Buat rencana bisnis baru yang impactful.',
    isPremium: false,
  },
  // {
  //   id: "chatbot-elmo",
  //   icon: Bot,
  //   title: "Chatbot Elmo",
  //   description: "Chatbot AI bantu cari lomba & analisis instan.",
  //   isPremium: true,
  // },
];

export const AsistenLombaFeatures = ({
  searchQuery,
  isPremium,
  onFeatureClick,
}: FeaturesProps) => {
  const filteredFeatures = features.filter(
    (feature) =>
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Asisten Lomba</h2>
        <p className="text-muted-foreground">
          AI Generator untuk essay, KTI, dan business plan lomba!
        </p>
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
