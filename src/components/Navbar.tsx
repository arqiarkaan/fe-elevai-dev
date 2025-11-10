import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  LayoutDashboard,
  Zap,
  DollarSign,
  Users,
} from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="w-6 h-6 text-primary" />
            ElevAI
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Zap className="w-4 h-4" />
              Features
            </a>
            <a
              href="#pricing"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <DollarSign className="w-4 h-4" />
              Pricing
            </a>
            <a
              href="#about"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Users className="w-4 h-4" />
              About
            </a>
          </div>

          {/* Login/Dashboard Button */}
          <SignedIn>
            <Link to="/dashboard">
              <Button variant="premium" size="sm">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link to="/login">
              <Button variant="outline" size="sm">
                <Sparkles className="w-4 h-4" />
                Login
              </Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};
