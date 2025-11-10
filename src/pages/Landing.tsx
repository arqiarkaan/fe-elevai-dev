import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { CTASection } from '@/components/landing/CTASection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TeamSection } from '@/components/landing/TeamSection';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <PricingSection />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default Landing;
