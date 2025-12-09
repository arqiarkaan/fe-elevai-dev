import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
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
import {
  Crown,
  Coins,
  LogOut,
  GraduationCap,
  Trophy,
  Users,
  Wrench,
  Menu,
  Bot,
} from 'lucide-react';
import { StudentDevelopmentFeatures } from '@/components/dashboard/StudentDevelopmentFeatures';
import { AsistenLombaFeatures } from '@/components/dashboard/AsistenLombaFeatures';
import { PersonalBrandingFeatures } from '@/components/dashboard/PersonalBrandingFeatures';
import { DailyToolsFeatures } from '@/components/dashboard/DailyToolsFeatures';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/auth';
import { useUserInfo } from '@/hooks/useUserInfo';
import { PremiumModal } from '@/components/payment/PremiumModal';
import { TokenModal } from '@/components/payment/TokenModal';

type Category = 'student' | 'lomba' | 'branding' | 'tools' | 'reviewer';

const categories = [
  {
    id: 'student' as Category,
    icon: GraduationCap,
    label: 'Student Development',
  },
  { id: 'lomba' as Category, icon: Trophy, label: 'Asisten Lomba' },
  { id: 'branding' as Category, icon: Users, label: 'Personal Branding' },
  { id: 'tools' as Category, icon: Wrench, label: 'Daily Tools' },
  // { id: 'reviewer' as Category, icon: FileCheck, label: 'Reviewer' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const { username, isPremium, tokens } = useUserInfo();

  const [activeCategory, setActiveCategory] = useState<Category>(() => {
    const saved = sessionStorage.getItem('dashboard_active_category');
    if (saved && ['student', 'lomba', 'branding', 'tools'].includes(saved)) {
      return saved as Category;
    }
    return 'student';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('dashboard_active_category', activeCategory);
  }, [activeCategory]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('dashboard_active_category');

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

  const handleFeatureClick = (featureId: string, isPremiumFeature: boolean) => {
    // Check if premium feature and user is not premium
    if (isPremiumFeature && !isPremium) {
      toast.error('Fitur ini khusus pengguna premium. Silahkan Upgrade!');
      setShowPremiumModal(true);
      return;
    }
    // Navigate to feature route
    navigate(`/dashboard/features/${featureId}`);
  };

  const handleOpenPremiumModal = () => {
    setIsSidebarOpen(false); // Close sidebar before opening modal
    setShowPremiumModal(true);
  };

  const handleOpenTokenModal = () => {
    setIsSidebarOpen(false); // Close sidebar before opening modal
    setShowTokenModal(true);
  };

  const renderFeatures = () => {
    const props = {
      searchQuery,
      isPremium,
      onFeatureClick: handleFeatureClick,
    };

    switch (activeCategory) {
      case 'student':
        return <StudentDevelopmentFeatures {...props} />;
      case 'lomba':
        return <AsistenLombaFeatures {...props} />;
      case 'branding':
        return <PersonalBrandingFeatures {...props} />;
      case 'tools':
        return <DailyToolsFeatures {...props} />;
      // case 'reviewer':
      //   return <ReviewerFeatures {...props} />;
      default:
        return null;
    }
  };

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
                        {tokens}
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
                  <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                  <SheetDescription className="sr-only">
                    Menu navigasi untuk mengakses profil dan fitur lainnya
                  </SheetDescription>
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
                          {tokens} Token
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
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Selamat Datang{username ? `, ${username}` : ''}!
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Pilih kategori dan mulai jelajahi fitur dengan AI.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category.id)}
              className="flex-shrink-0 text-base py-6 px-6"
              size="lg"
            >
              <category.icon className="w-5 h-5" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-10">
          <div className="relative max-w-xl">
            <Input
              placeholder="Cari Mode"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-base py-6 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Features */}
        {renderFeatures()}

        {/* Upgrade CTA - Only show if not premium */}
        {!isPremium && (
          <Card className="p-8 gradient-primary text-center shadow-premium border-0 relative overflow-hidden mt-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse-glow" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3 text-primary-foreground">
                Tingkatkan potensi Anda!
              </h3>
              <p className="text-primary-foreground/90 mb-6">
                Upgrade ke Premium untuk membuka semua fitur canggih.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
                onClick={handleOpenPremiumModal}
              >
                <Crown className="w-4 h-4" />
                Upgrade Sekarang
              </Button>
            </div>
          </Card>
        )}
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

export default Dashboard;
