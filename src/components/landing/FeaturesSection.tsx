import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { FileText, BarChart3, Users, Briefcase, Target, Mail } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Essay & KTI",
    description: "Generator esai dan KTI yang terstruktur, siap pakai, dan mudah dipelajari."
  },
  {
    icon: BarChart3,
    title: "Analitik Pribadi",
    description: "Ikigai, SWOT, dan perencanaan tujuan dengan insight yang relevan."
  },
  {
    icon: Users,
    title: "Branding",
    description: "Optimasi LinkedIn dan Instagram Bio yang profesional."
  },
  {
    icon: Briefcase,
    title: "Business Plan",
    description: "Rangkuman eksekutif, strategi pasar, dan poin keuangan dalam sekali klik."
  },
  {
    icon: Target,
    title: "Goals Planner",
    description: "Rencana semester dan tindakan mingguan yang realistis dan terukur."
  },
  {
    icon: Mail,
    title: "Motivation Letter",
    description: "Asisten draf ML untuk exchange beasiswa dengan gaya yang tepat."
  },
];

export const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="py-24 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Fitur Unggulan</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk belajar, berkarya, dan berkembang.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="p-6 gradient-card border-border/50 hover:border-primary/50 transition-smooth hover:shadow-glow h-full group cursor-pointer">
                <feature.icon className="w-12 h-12 text-primary mb-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-[360deg]" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
