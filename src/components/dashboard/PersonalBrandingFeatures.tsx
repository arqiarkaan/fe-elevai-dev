import { FeatureCard } from './FeatureCard';
import { Instagram, Linkedin } from 'lucide-react';

interface FeaturesProps {
  searchQuery: string;
  isPremium: boolean;
  onFeatureClick: (id: string, isPremium: boolean) => void;
}

const features = [
  {
    id: 'instagram-bio-analyzer',
    icon: Instagram,
    title: 'Instagram Bio Analyzer',
    description: 'Optimalkan bio IG kamu sesuai gaya dan keahlian.',
    isPremium: true,
  },
  {
    id: 'linkedin-profile-optimizer',
    icon: Linkedin,
    title: 'LinkedIn Profile Optimizer',
    description: 'Buat Headline & Summary LinkedIn profesional dengan AI.',
    isPremium: true,
  },
];

export const PersonalBrandingFeatures = ({
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
        <h2 className="text-3xl font-bold mb-2">Personal Branding</h2>
        <p className="text-muted-foreground">
          Tingkatkan citra dirimu dengan tools AI untuk branding profesional.
        </p>
      </div>

      {filteredFeatures.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Mode yang Anda cari tidak ada
          </h3>
          <p className="text-muted-foreground">
            Coba kata kunci lain atau ubah kategori
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
};
