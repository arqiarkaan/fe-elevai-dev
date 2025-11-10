import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Mail, CheckCircle2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/auth';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { user, loading: authLoading } = useAuthStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(() => {
    // Restore countdown from sessionStorage on page load
    const stored = sessionStorage.getItem(`otp_countdown_${email}`);
    const storedTime = sessionStorage.getItem(`otp_timestamp_${email}`);

    if (stored && storedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(storedTime)) / 1000);
      const remaining = parseInt(stored) - elapsed;
      return remaining > 0 ? remaining : 0;
    }
    return 60;
  });
  const [canResend, setCanResend] = useState(false);

  // Redirect if already verified
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast.error('Email tidak ditemukan. Silakan signup terlebih dahulu.');
      navigate('/signup');
    }
  }, [email, navigate]);

  // Countdown timer with sessionStorage persistence
  useEffect(() => {
    if (countdown > 0) {
      // Save countdown to sessionStorage
      sessionStorage.setItem(`otp_countdown_${email}`, countdown.toString());
      sessionStorage.setItem(`otp_timestamp_${email}`, Date.now().toString());

      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
      // Clear storage when countdown ends
      sessionStorage.removeItem(`otp_countdown_${email}`);
      sessionStorage.removeItem(`otp_timestamp_${email}`);
    }
  }, [countdown, email]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5);
    document.getElementById(`otp-${lastIndex}`)?.focus();
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Mohon masukkan kode OTP 6 digit.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'signup',
      });

      if (error) {
        let errorMessage = error.message;

        if (error.message.includes('expired')) {
          errorMessage = 'Kode OTP sudah kadaluarsa. Silakan minta kode baru.';
        } else if (error.message.includes('invalid')) {
          errorMessage = 'Kode OTP tidak valid. Mohon periksa kembali.';
        } else if (error.message.includes('too many attempts')) {
          errorMessage = 'Terlalu banyak percobaan. Mohon minta kode baru.';
        }

        toast.error(errorMessage);
        return;
      }

      if (data.user && data.session) {
        // User is now logged in automatically after OTP verification
        toast.success(
          'Email berhasil diverifikasi! Selamat datang di ElevAI!',
          {
            duration: 3000,
          }
        );

        // Clear sessionStorage
        sessionStorage.removeItem(`otp_countdown_${email}`);
        sessionStorage.removeItem(`otp_timestamp_${email}`);

        // Redirect to dashboard after 1 second
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat verifikasi. Silakan coba lagi.');
      console.error('Verify OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        toast.error('Gagal mengirim ulang kode OTP. Silakan coba lagi.');
        return;
      }

      toast.success('Kode OTP baru telah dikirim ke email Anda!');

      // Reset countdown and update sessionStorage
      setCountdown(60);
      sessionStorage.setItem(`otp_countdown_${email}`, '60');
      sessionStorage.setItem(`otp_timestamp_${email}`, Date.now().toString());

      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow-delayed" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 glass-effect border-primary/20 shadow-premium">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/signup')}
              className="mb-6 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gradient mb-2">
              Verifikasi Email
            </h2>
            <p className="text-muted-foreground">
              Masukkan kode 6 digit yang telah dikirim ke
            </p>
            <p className="text-primary font-semibold mt-1">{email}</p>
          </motion.div>

          {/* OTP Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* OTP Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-2xl font-bold glass-effect border-primary/30 focus:border-primary"
                    disabled={isLoading}
                  />
                ))}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button
                type="submit"
                variant="premium"
                className="w-full"
                disabled={isLoading || otp.join('').length !== 6}
              >
                {isLoading ? (
                  <>
                    <Mail className="w-4 h-4 mr-2 animate-pulse" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Verifikasi Email
                  </>
                )}
              </Button>
            </motion.div>

            {/* Resend Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-center"
            >
              {canResend ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-primary hover:bg-primary/10"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Kirim Ulang Kode OTP
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Kirim ulang kode dalam{' '}
                  <span className="font-bold text-primary">{countdown}</span>{' '}
                  detik
                </p>
              )}
            </motion.div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold text-blue-500 mb-1">
                    Tidak menerima kode?
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Cek folder spam/junk email Anda</li>
                    <li>Kode berlaku selama 10 menit</li>
                    <li>Pastikan email yang dimasukkan benar</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </form>

          {/* Login Link */}
          <motion.p
            className="text-center text-sm text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login Sekarang
            </Link>
          </motion.p>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
