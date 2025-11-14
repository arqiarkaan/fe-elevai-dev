import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Search, ArrowLeft, Bot, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
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
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <Card className="max-w-xl w-full p-6 md:p-8 gradient-card border-border/50 shadow-glow relative z-10">
        <div className="text-center space-y-6">
          {/* Animated 404 with Robot Icon */}
          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-2xl animate-pulse-glow" />
                <Bot className="w-16 h-16 md:w-20 md:h-20 text-primary relative z-10 animate-bounce" />
              </div>
              <div className="relative">
                <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
                  404
                </h1>
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Oops! Halaman Tidak Ditemukan
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
              Sepertinya halaman yang kamu cari sedang liburan atau tidak pernah
              ada. Mari kita bantu kamu kembali ke jalur yang benar!
            </p>
          </div>

          {/* Searched Path Info */}
          <div className="bg-muted/30 border border-border/50 rounded-lg p-3 max-w-lg mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <code className="text-muted-foreground break-all text-left text-xs">
                {location.pathname}
              </code>
            </div>
          </div>

          {/* Divider with Sparkles */}
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                onClick={() => navigate('/')}
                variant="premium"
                size="default"
                className="w-full"
              >
                <Home className="w-4 h-4" />
                Ke Beranda
              </Button>

              {user ? (
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  size="default"
                  className="w-full"
                >
                  <Bot className="w-4 h-4" />
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="default"
                  className="w-full"
                >
                  <Bot className="w-4 h-4" />
                  Login
                </Button>
              )}
            </div>

            <Button
              onClick={handleGoBack}
              variant="ghost"
              size="default"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </div>

          {/* Popular Links */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
              Mungkin Kamu Mencari:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: '🏠 Beranda', path: '/' },
                ...(user
                  ? [{ label: '🎯 Dashboard', path: '/dashboard' }]
                  : [
                      { label: '🔐 Login', path: '/login' },
                      { label: '📝 Sign Up', path: '/signup' },
                    ]),
              ].map((link, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (link.path.includes('#')) {
                      navigate('/');
                      setTimeout(() => {
                        const element = document.querySelector(
                          link.path.split('#')[1]
                        );
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      navigate(link.path);
                    }
                  }}
                  className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-1.5 hover:bg-muted/50 hover:text-foreground transition-smooth"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
