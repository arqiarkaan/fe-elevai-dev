import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Coins, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const premiumPlans = [
  {
    icon: Crown,
    title: 'Premium 1 Bulan',
    description: 'Akses penuh semua fitur premium ElevAI selama 30 hari.',
    price: 'Rp 39.000',
    isBestValue: false,
  },
  {
    icon: Crown,
    title: 'Premium 1 Tahun',
    description:
      'Hemat lebih banyak dengan akses premium penuh selama 365 hari.',
    price: 'Rp 399.000',
    isBestValue: true,
  },
];

const tokenPackages = [
  {
    icon: Coins,
    title: '5 Token',
    description: 'Cocok untuk mencoba beberapa fitur premium.',
    price: 'Rp 7.495',
    isBestValue: false,
  },
  {
    icon: Coins,
    title: '10 Token',
    description: 'Pilihan populer untuk penggunaan reguler.',
    price: 'Rp 9.999',
    isBestValue: true,
  },
];

export const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="pricing" ref={ref} className="py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pilihan Paket Untuk Anda
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Investasi terbaik untuk pengembangan diri Anda. Pilih paket yang
            paling sesuai dengan kebutuhan.
          </p>
        </motion.div>

        {/* Premium Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Langganan Premium
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {premiumPlans.map((plan, index) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.95 }
                }
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card
                  className={`p-8 gradient-card border-border/50 hover:border-primary/50 transition-smooth hover:shadow-premium h-full relative overflow-hidden group ${
                    plan.isBestValue ? 'shadow-premium' : ''
                  }`}
                >
                  {plan.isBestValue && (
                    <Badge className="absolute top-4 right-4 gradient-primary">
                      <Zap className="w-3 h-3 mr-1" />
                      Best Value
                    </Badge>
                  )}
                  <plan.icon className="w-16 h-16 text-primary mb-6 group-hover:scale-110 transition-smooth" />
                  <h4 className="text-2xl font-bold mb-3">{plan.title}</h4>
                  <p className="text-muted-foreground mb-6">
                    {plan.description}
                  </p>
                  <div className="text-4xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                  </div>
                  <Link to="/dashboard">
                    <Button variant="premium" className="w-full" size="lg">
                      Pilih Paket
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Token Packages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">Paket Token</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {tokenPackages.map((pkg, index) => (
              <motion.div
                key={pkg.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.95 }
                }
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Card
                  className={`p-8 gradient-card border-border/50 hover:border-secondary/50 transition-smooth hover:shadow-glow h-full relative overflow-hidden group ${
                    pkg.isBestValue ? 'shadow-glow' : ''
                  }`}
                >
                  {pkg.isBestValue && (
                    <Badge className="absolute top-4 right-4 gradient-secondary">
                      <Zap className="w-3 h-3 mr-1" />
                      Best Value
                    </Badge>
                  )}
                  <pkg.icon className="w-16 h-16 text-secondary mb-6 group-hover:scale-110 transition-smooth" />
                  <h4 className="text-2xl font-bold mb-3">{pkg.title}</h4>
                  <p className="text-muted-foreground mb-6">
                    {pkg.description}
                  </p>
                  <div className="text-4xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                      {pkg.price}
                    </span>
                  </div>
                  <Link to="/dashboard">
                    <Button variant="token" className="w-full" size="lg">
                      Pilih Paket
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
