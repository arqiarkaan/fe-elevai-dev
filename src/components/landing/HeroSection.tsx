import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sparkles,
  BarChart3,
  Briefcase,
  Lightbulb,
  User,
  MessageSquare,
  Shield,
  Award,
  Globe,
  Zap,
} from 'lucide-react';

const featureCards = [
  { icon: Sparkles, title: 'AI Essay Generator' },
  { icon: BarChart3, title: 'Smart Analytics' },
  { icon: Briefcase, title: 'Business Intelligence' },
  { icon: Lightbulb, title: 'Creative Solutions' },
  { icon: User, title: 'Personal Branding' },
  { icon: MessageSquare, title: 'Interview Simulation' },
];

const trustBadges = [
  { icon: Shield, text: 'Keamanan & Privasi' },
  { icon: Award, text: 'Kualitas Teruji' },
  { icon: Globe, text: 'Skala Internasional' },
  { icon: Zap, text: 'Inovasi Berkelanjutan' },
];

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden pt-20">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4">
              <img
                src="/logo-elevai.png"
                alt="ElevAI Logo"
                className="mx-auto h-40 md:h-48 w-auto"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-lg md:text-xl font-semibold mb-8 text-muted-foreground tracking-wider">
              YOUR NO. 1 HOLISTIC STUDENT DEVELOPMENT WITH SMART AI-PERSONALIZED
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Masa Depan Kecerdasan Buatan Dimulai Dari Sini
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Platform AI terdepan yang menghadirkan solusi cerdas untuk essay,
              riset, bisnis plan, dan analisis kepribadian dengan teknologi
              machine learning terbaru.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 mt-12"
          >
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.08, y: -8 }}
              >
                <Card className="p-6 gradient-card border-border/50 hover:border-primary/50 transition-smooth hover:shadow-glow cursor-pointer group">
                  <card.icon className="w-8 h-8 mx-auto mb-3 text-primary transition-all duration-500 group-hover:scale-125 group-hover:rotate-[360deg]" />
                  <h3 className="font-semibold text-sm">{card.title}</h3>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12"
          >
            <Link to="/dashboard">
              <Button variant="premium" size="lg" className="text-lg px-12">
                Mulai Eksplorasi
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <Card className="p-4 gradient-card border-border/50">
                  <div className="flex items-center gap-3">
                    <badge.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{badge.text}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
