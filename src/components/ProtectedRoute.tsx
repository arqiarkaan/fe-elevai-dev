import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  // TODO: Replace with actual auth state
  const isLoggedIn = false;

  if (isLoggedIn) {
    return <>{children}</>;
  }

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

      <Card className="max-w-lg w-full p-8 md:p-12 gradient-card border-border/50 shadow-glow relative z-10">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-glow" />
              <img
                src="/logo-elevai.png"
                alt="ElevAI Logo"
                className="w-20 h-20 relative z-10"
              />
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Login Dulu, Yuk!
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Untuk mengakses fitur{' '}
              <span className="text-primary font-semibold">ElevAI</span>, kamu
              perlu login dulu. Tenang, prosesnya cepat dan mudah kok!
            </p>
          </div>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center">
              <Sparkles className="w-6 h-6 text-primary bg-card px-2" />
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/login')}
              variant="premium"
              size="lg"
              className="w-full text-lg"
            >
              Masuk Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="text-sm text-muted-foreground">
              Belum punya akun?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-primary hover:text-primary/80 font-semibold underline-offset-2 hover:underline transition-smooth"
              >
                Daftar Gratis
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
              Yang Bisa Kamu Akses:
            </p>
            <div className="grid grid-cols-2 gap-3 text-left">
              {[
                '🎯 Student Development',
                '🏆 Asisten Lomba',
                '👥 Personal Branding',
                '🔧 Daily Tools',
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 hover:bg-muted/50 transition-smooth"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
