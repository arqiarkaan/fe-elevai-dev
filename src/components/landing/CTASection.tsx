import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Zap, TrendingUp } from "lucide-react";

export const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { icon: Sparkles, text: "AI-Powered" },
    { icon: Zap, text: "Instan" },
    { icon: TrendingUp, text: "Produktif" }
  ];

  return (
    <section ref={ref} className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-12 md:p-20 gradient-primary text-center shadow-premium border-0 relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
              className="absolute top-10 left-10 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -40, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary-foreground/5 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              {/* Feature badges */}
              <div className="flex justify-center gap-4 mb-8 flex-wrap">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
                      <feature.icon className="w-4 h-4 text-primary-foreground" />
                      <span className="text-sm font-medium text-primary-foreground">{feature.text}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.h2
                className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Tingkatkan produktivitas Anda
              </motion.h2>
              
              <motion.p
                className="text-lg md:text-2xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Coba gratis dan rasakan perbedaannya dalam hitungan menit.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to="/signup">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-16 py-6 h-auto bg-background text-foreground hover:bg-background/90 border-2 shadow-2xl group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Coba Sekarang
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                className="mt-8 flex items-center justify-center gap-6 text-primary-foreground/70 text-sm flex-wrap"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Gratis 7 hari</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-primary-foreground/50" />
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Tidak perlu kartu kredit</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-primary-foreground/50" />
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Batalkan kapan saja</span>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
