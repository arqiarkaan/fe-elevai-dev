import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        'Link reset password telah dikirim! Silakan cek email Anda (termasuk folder spam) untuk melanjutkan proses reset password.',
        { duration: 5000 }
      );
      setEmail('');
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-8 gradient-card border-border/50 shadow-glow">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  {/* Glow effect behind logo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-full blur-2xl scale-150 animate-pulse-glow" />
                  {/* Logo */}
                  <img
                    src="/logo-elevai.png"
                    alt="ElevAI Logo"
                    className="h-28 w-auto relative z-10"
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Lupa Password?</h2>
              <p className="text-muted-foreground text-sm">
                Masukkan email terdaftar Anda dan kami akan mengirimkan link
                untuk reset password
              </p>
            </motion.div>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Label htmlFor="email">Email Terdaftar</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="contoh: nama@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Button
                  type="submit"
                  variant="premium"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                </Button>
              </motion.div>
            </form>

            <motion.p
              className="text-center text-sm text-muted-foreground mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              Belum punya akun?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Daftar Sekarang
              </Link>
            </motion.p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
