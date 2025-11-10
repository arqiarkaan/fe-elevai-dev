import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';

const teamMembers = [
  {
    name: 'Fahmi Nur Alim',
    role: 'Founder & CEO',
    instagram: '#',
    photo: '/1-fahmi.JPG',
  },
  {
    name: 'Ginanjar Pamungkas',
    role: 'Co-Founder & COO',
    instagram: '#',
    photo: '/2-ginan.jpeg',
  },
  {
    name: 'Hisyam Az-Zahran',
    role: 'Co-Founder & CPO',
    instagram: '#',
    photo: '/3-sam.png',
  },
  {
    name: 'Najwa Nur Awalia',
    role: 'Co-Founder & CMO',
    instagram: '#',
    photo: '/4-nana.jpeg',
  },
];

export const TeamSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 relative overflow-hidden bg-gradient-to-b from-card/30 to-background"
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">Meet The Team</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -10 }}
              className="flex"
            >
              <Card className="p-6 gradient-card border-border/50 hover:border-primary/50 transition-smooth hover:shadow-glow text-center group cursor-pointer w-full flex flex-col">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-32 h-32 md:w-36 md:h-36 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gradient-to-br from-primary to-accent flex-shrink-0"
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <h3 className="text-lg md:text-xl font-bold mb-2 min-h-[3.5rem] flex items-center justify-center">
                  {member.name}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm min-h-[2.5rem] flex items-center justify-center">
                  {member.role}
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-auto"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
