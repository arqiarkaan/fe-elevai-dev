import { FeatureCard } from './FeatureCard';
import {
  Target,
  BarChart3,
  Calendar,
  ClipboardList,
  MessageSquare,
  Mail,
} from 'lucide-react';

interface FeaturesProps {
  searchQuery: string;
  isPremium: boolean;
  onFeatureClick: (id: string, isPremium: boolean) => void;
}

const features = [
  {
    id: 'ikigai',
    icon: Target,
    title: 'Ikigai Self Discovery',
    description: 'Pemetaan Ikigai dan Strategi Karier Berbasis AI.',
    isPremium: true,
  },
  {
    id: 'swot',
    icon: BarChart3,
    title: 'SWOT Self Analysis',
    description: 'Kenali kekuatan & tantangan dirimu lewat MBTI & VIA.',
    isPremium: true,
  },
  // {
  //   id: "goals-planning",
  //   icon: Calendar,
  //   title: "Student Goals Planning",
  //   description: "Rencanakan tujuan studimu per semester dengan AI.",
  //   isPremium: true,
  // },
  // {
  //   id: "daily-activity",
  //   icon: ClipboardList,
  //   title: "Student Daily Activity",
  //   description: "Ubah rencana semestermu menjadi jadwal mingguan yang bisa dieksekusi.",
  //   isPremium: true,
  // },
  {
    id: 'interview-simulation',
    icon: MessageSquare,
    title: 'Interview Simulasi',
    description: 'Simulasi interview beasiswa & magang berbasis AI.',
    isPremium: true,
  },
  {
    id: 'essay-exchanges',
    icon: Mail,
    title: 'Essay Exchanges',
    description: 'Asisten AI untuk Motivation Letter Exchange.',
    isPremium: true,
  },
];

export const StudentDevelopmentFeatures = ({
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
        <h2 className="text-3xl font-bold mb-2">Student Development</h2>
        <p className="text-muted-foreground">
          Pengembangan diri, karier, dan persiapan masa depan 🎓
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
