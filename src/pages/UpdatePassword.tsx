import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/auth';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isFromResetLink, setIsFromResetLink] = useState(false);

  useEffect(() => {
    // Check if user came from password reset link
    const checkSession = async () => {
      // Supabase uses hash fragments for auth tokens, not query params
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const searchParams = new URLSearchParams(window.location.search);

      // Check both hash and search params for recovery tokens
      const hasRecoveryToken =
        hashParams.get('type') === 'recovery' ||
        searchParams.get('type') === 'recovery';
      const hasAccessToken =
        hashParams.has('access_token') || searchParams.has('access_token');

      // If URL has recovery token, this is a valid password reset
      if (hasRecoveryToken || hasAccessToken) {
        setIsValidSession(true);
        setIsFromResetLink(true);

        // Store in sessionStorage that this is a password reset flow
        sessionStorage.setItem('isPasswordReset', 'true');
        return; // Allow access to update password form
      }

      // Check if this is a password reset flow (even if URL params are gone after redirect)
      const isPasswordResetFlow =
        sessionStorage.getItem('isPasswordReset') === 'true';

      if (isPasswordResetFlow) {
        setIsValidSession(true);
        setIsFromResetLink(true);
        return; // Allow access to update password form
      }

      // Check if there's an active session (user might have been authenticated by Supabase)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If there's a session, assume this is password reset flow
      // (since normal logged-in users wouldn't access this page)
      if (session) {
        setIsValidSession(true);
        setIsFromResetLink(true);
        sessionStorage.setItem('isPasswordReset', 'true');
        return;
      }

      // No valid recovery token, no session - redirect to forgot password
      toast.error('Link reset password tidak valid atau sudah expired');
      navigate('/forgot-password', { replace: true });
    };

    if (!authLoading) {
      checkSession();
    }
  }, [navigate, authLoading]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Password tidak sama');
      return;
    }

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Clear the password reset flag
      sessionStorage.removeItem('isPasswordReset');

      // Sign out user so they need to login again with new password
      await supabase.auth.signOut();

      // Redirect to login with success state
      navigate('/login', {
        replace: true,
        state: { passwordUpdated: true },
      });
    } catch (error) {
      toast.error('Terjadi kesalahan saat memperbarui password');
      console.error('Update password error:', error);
    } finally {
      setIsLoading(false);
    }
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
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-full blur-2xl scale-150 animate-pulse-glow" />
                  <img
                    src="/logo-elevai.png"
                    alt="ElevAI Logo"
                    className="h-28 w-auto relative z-10"
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Buat Password Baru</h2>
              <p className="text-muted-foreground text-sm">
                Masukkan password baru Anda
              </p>
            </motion.div>

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Label htmlFor="password">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Button
                  type="submit"
                  variant="premium"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Lock className="w-4 h-4 mr-2 animate-spin" />
                      Memperbarui...
                    </>
                  ) : (
                    'Perbarui Password'
                  )}
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdatePassword;
