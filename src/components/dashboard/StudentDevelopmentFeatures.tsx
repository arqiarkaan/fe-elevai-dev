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
