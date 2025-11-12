import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Crown, Coins, LogOut, Menu, Bot } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { useUserStore, subscribeToProfileChanges } from '@/lib/user-store';
import { PremiumModal } from '@/components/payment/PremiumModal';
import { TokenModal } from '@/components/payment/TokenModal';
import { toast } from 'sonner';

export const FeatureLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const { profile, fetchProfile } = useUserStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
      // Subscribe to real-time profile changes
      const unsubscribe = subscribeToProfileChanges(user.id);
      return unsubscribe;
    }
  }, [user?.id, fetchProfile]);

  // Check if user is premium and not expired
  const isPremium =
    profile?.is_premium &&
    (!profile.premium_expires_at ||
      new Date(profile.premium_expires_at) > new Date());

  const userTokens = profile?.tokens || 0;

  // Get user's first name from metadata, fallback to email
  const getFirstName = () => {
    const fullName = user?.user_metadata?.full_name;
    if (fullName) {
      return fullName.split(' ')[0]; // Take only first word
    }
    return user?.email?.split('@')[0] || 'User';
  };
  const username = getFirstName();

  const handleBack = () => {
    // Clear session storage for current feature
    const featureName = location.pathname.split('/').pop();
    if (featureName) {
      try {
        sessionStorage.removeItem(`feature_state_${featureName}`);
      } catch (error) {
        console.error('Error clearing feature state:', error);
      }
    }

    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Berhasil logout');
      navigate('/');
    } catch (error) {
      toast.error('Gagal logout');
      console.error('Logout error:', error);
    }
  };

  const confirmLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleOpenPremiumModal = () => {
    setIsSidebarOpen(false);
    setShowPremiumModal(true);
  };

  const handleOpenTokenModal = () => {
    setIsSidebarOpen(false);
    setShowTokenModal(true);
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen gradient-hero">
      {/* Navbar */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-lg md:text-xl">
              <Bot className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              ElevAI
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {!isPremium && (
                <Button
                  variant="premium"
                  size="sm"
                  onClick={handleOpenPremiumModal}
                >
                  <Crown className="w-4 h-4" />
                  Jadi Premium
                </Button>
              )}
              <Button variant="token" size="sm" onClick={handleOpenTokenModal}>
                <Coins className="w-4 h-4" />
                Beli Token
              </Button>
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-card border border-border/50">
                <span className="text-sm font-medium">{username}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    isPremium
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isPremium ? 'Premium' : 'Basic'}
                </span>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-help">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold text-amber-500">
                        {userTokens}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Token yang anda miliki</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button variant="ghost" size="icon" onClick={confirmLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center gap-2">
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <div className="flex flex-col gap-4 mt-8">
                    <div className="flex flex-col gap-4 px-4 py-4 rounded-lg bg-card border border-border/50">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <span className="text-lg font-bold">{username}</span>
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${
                            isPremium
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {isPremium ? '👑 Premium' : 'Basic'}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10">
                        <Coins className="w-5 h-5 text-amber-500" />
                        <span className="text-base font-bold text-amber-500">
                          {userTokens} Token
                        </span>
                      </div>
                    </div>
                    {!isPremium && (
                      <Button
                        variant="premium"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleOpenPremiumModal}
                      >
                        <Crown className="w-4 h-4" />
                        Jadi Premium
                      </Button>
                    )}
                    <Button
                      variant="token"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleOpenTokenModal}
                    >
                      <Coins className="w-4 h-4" />
                      Beli Token
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={confirmLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={handleBack}
          className="mb-6 hover:border-primary/50 transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Button>
        <Card className="p-6 md:p-8 gradient-card border-border/50">
          <Outlet />
        </Card>
      </div>

      {/* Payment Modals */}
      <PremiumModal
        open={showPremiumModal}
        onOpenChange={setShowPremiumModal}
      />
      <TokenModal open={showTokenModal} onOpenChange={setShowTokenModal} />

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari akun Anda? Anda perlu login
              kembali untuk mengakses dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Ya, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
