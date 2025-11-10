import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { UserPlus, MousePointer, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "1. Daftar",
    description: "Buat akun atau login untuk menyimpan progres Anda."
  },
  {
    icon: MousePointer,
    title: "2. Pilih Mode",
    description: "Pilih fitur yang Anda butuhkan: esai, KTI, branding, atau analitik."
  },
  {
    icon: CheckCircle,
    title: "3. Dapatkan Hasil",
    description: "Terapkan hasilnya dengan mudah; siap dipresentasikan atau dikirim."
  },
];

export const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-card/30">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Cara Kerja</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tiga langkah sederhana untuk mulai produktif.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="flex"
            >
              <Card className="p-6 md:p-8 gradient-card border-border/50 hover:border-secondary/50 transition-smooth hover:shadow-glow w-full text-center group cursor-pointer relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <step.icon className="w-14 h-14 md:w-16 md:h-16 text-secondary mb-4 md:mb-6 mx-auto relative z-10 transition-all duration-500 group-hover:scale-125 group-hover:rotate-[360deg] flex-shrink-0" />
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 relative z-10">{step.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed relative z-10 break-words">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
