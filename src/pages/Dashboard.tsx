import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
  Sparkles,
  Crown,
  Coins,
  LogOut,
  GraduationCap,
  Trophy,
  Users,
  Wrench,
  FileCheck,
  ArrowLeft,
  Menu,
} from 'lucide-react';
import { StudentDevelopmentFeatures } from '@/components/dashboard/StudentDevelopmentFeatures';
import { AsistenLombaFeatures } from '@/components/dashboard/AsistenLombaFeatures';
import { PersonalBrandingFeatures } from '@/components/dashboard/PersonalBrandingFeatures';
import { DailyToolsFeatures } from '@/components/dashboard/DailyToolsFeatures';
import { ReviewerFeatures } from '@/components/dashboard/ReviewerFeatures';
import { toast } from 'sonner';
import { IkigaiFeature } from '@/features/ikigai/IkigaiFeature';
import { SwotFeature } from '@/features/swot/SwotFeature';
import { InterviewFeature } from '@/features/interview/InterviewFeature';
import { EssayExchangeFeature } from '@/features/essay-exchange/EssayExchangeFeature';
import { EssayGeneratorFeature } from '@/features/essay-generator/EssayGeneratorFeature';
import { KtiGeneratorFeature } from '@/features/kti-generator/KtiGeneratorFeature';
import { BusinessPlanFeature } from '@/features/business-plan/BusinessPlanFeature';
import { VeoPromptingFeature } from '@/features/veo-prompting/VeoPromptingFeature';
import { PromptEnhancerFeature } from '@/features/prompt-enhancer/PromptEnhancerFeature';
import { InstagramBioFeature } from '@/features/instagram-bio/InstagramBioFeature';
import { LinkedInOptimizerFeature } from '@/features/linkedin-optimizer/LinkedInOptimizerFeature';
import { useAuthStore } from '@/lib/auth';
import { useUserStore, subscribeToProfileChanges } from '@/lib/user-store';
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
  const { user, signOut } = useAuthStore();
  const { profile, fetchProfile } = useUserStore();
  const [activeCategory, setActiveCategory] = useState<Category>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  
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
  const isPremium = profile?.is_premium && 
    (!profile.premium_expires_at || new Date(profile.premium_expires_at) > new Date());
  
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

  const handleFeatureClick = (featureId: string, isPremiumFeature: boolean) => {
    // Check if premium feature and user is not premium
    if (isPremiumFeature && !isPremium) {
      toast.error('Fitur ini khusus pengguna premium. Silahkan Upgrade!');
      setShowPremiumModal(true);
      return;
    }
    setSelectedFeature(featureId);
  };

  const renderFeatureContent = () => {
    switch (selectedFeature) {
      case 'ikigai':
        return <IkigaiFeature />;
      case 'swot':
        return <SwotFeature />;
      case 'interview-simulation':
        return <InterviewFeature />;
      case 'essay-exchanges':
        return <EssayExchangeFeature />;
      case 'essay-generator':
        return <EssayGeneratorFeature />;
      case 'kti-generator':
        return <KtiGeneratorFeature />;
      case 'business-plan':
        return <BusinessPlanFeature />;
      case 'veo-prompting':
        return <VeoPromptingFeature />;
      case 'prompt-enhancer':
        return <PromptEnhancerFeature />;
      case 'instagram-bio':
        return <InstagramBioFeature />;
      case 'linkedin-optimizer':
        return <LinkedInOptimizerFeature />;
      default:
        return null;
    }
  };

  const handleBackToCategory = () => {
    setSelectedFeature(null);
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

  if (selectedFeature) {
    return (
      <div className="min-h-screen gradient-hero">
        <nav className="border-b border-border/50 bg-background/80 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-lg md:text-xl">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                ElevAI
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-3">
                {!isPremium && (
                  <Button variant="premium" size="sm" onClick={() => setShowPremiumModal(true)}>
                    <Crown className="w-4 h-4" />
                    Jadi Premium
                  </Button>
                )}
                <Button variant="token" size="sm" onClick={() => setShowTokenModal(true)}>
                  <Coins className="w-4 h-4" />
                  Beli Token
                </Button>
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-card border border-border/50">
                  <span className="text-sm font-medium">{username}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    isPremium 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
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
                <Sheet>
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
                          <span className={`text-sm px-3 py-1 rounded-full ${
                            isPremium 
                              ? 'bg-primary/10 text-primary font-semibold' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
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
                          onClick={() => setShowPremiumModal(true)}
                        >
                          <Crown className="w-4 h-4" />
                          Jadi Premium
                        </Button>
                      )}
                      <Button
                        variant="token"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setShowTokenModal(true)}
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

        <div className="container mx-auto px-4 py-8">
          <Button
            variant="outline"
            onClick={handleBackToCategory}
            className="mb-6 hover:border-primary/50 transition-smooth"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke {categories.find((c) => c.id === activeCategory)?.label}
          </Button>
          <Card className="p-6 md:p-8 gradient-card border-border/50">
            {renderFeatureContent()}
          </Card>
        </div>

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
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Navbar */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-lg md:text-xl">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              ElevAI
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {!isPremium && (
                <Button variant="premium" size="sm" onClick={() => setShowPremiumModal(true)}>
                  <Crown className="w-4 h-4" />
                  Jadi Premium
                </Button>
              )}
              <Button variant="token" size="sm" onClick={() => setShowTokenModal(true)}>
                <Coins className="w-4 h-4" />
                Beli Token
              </Button>
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-card border border-border/50">
                <span className="text-sm font-medium">{username}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  isPremium 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'bg-muted text-muted-foreground'
                }`}>
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
              <Sheet>
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
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          isPremium 
                            ? 'bg-primary/10 text-primary font-semibold' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
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
                        onClick={() => setShowPremiumModal(true)}
                      >
                        <Crown className="w-4 h-4" />
                        Jadi Premium
                      </Button>
                    )}
                    <Button
                      variant="token"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowTokenModal(true)}
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Selamat Datang{username ? `, ${username}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Pilih kategori dan mulai jelajahi fitur dengan AI.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category.id)}
              className="flex-shrink-0"
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Cari Mode"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
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
                onClick={() => setShowPremiumModal(true)}
              >
                <Crown className="w-4 h-4" />
                Upgrade Sekarang
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Payment Modals */}
      <PremiumModal open={showPremiumModal} onOpenChange={setShowPremiumModal} />
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
