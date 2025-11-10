import { Link } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const Signup = () => {
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
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <Card className="p-8 gradient-card border-border/50 shadow-glow">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img
                src="/logo-elevai.png"
                alt="ElevAI Logo"
                className="h-20 w-auto"
              />
            </div>
            <p className="text-muted-foreground">Bergabung dengan Masa Depan</p>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none w-full',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton:
                  'bg-background border border-border hover:bg-muted/50 transition-smooth text-foreground',
                socialButtonsBlockButtonText: 'font-medium',
                formButtonPrimary:
                  'bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-smooth shadow-premium text-primary-foreground',
                formFieldInput:
                  'bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary',
                formFieldLabel: 'text-foreground font-medium',
                formFieldInputShowPasswordButton:
                  'text-muted-foreground hover:text-foreground',
                formFieldSuccessText:
                  'text-green-600 dark:text-green-400 font-medium',
                formFieldErrorText:
                  'text-red-600 dark:text-red-400 font-medium',
                formFieldWarningText:
                  'text-yellow-600 dark:text-yellow-400 font-medium',
                formFieldInfoText: 'text-foreground font-medium',
                formFieldHintText: 'text-foreground/80 font-medium',
                identityPreviewText: 'text-foreground',
                identityPreviewEditButton: 'text-primary hover:text-primary/80',
                footer:
                  'bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50',
                footerActionText:
                  'text-slate-900 dark:text-slate-100 font-medium',
                footerActionLink:
                  'text-primary hover:text-primary/80 font-medium',
                formResendCodeLink:
                  'text-primary hover:text-primary/80 font-medium',
                otpCodeFieldInput:
                  'bg-background border-border text-foreground focus:border-primary',
                alertText: 'text-foreground font-medium',
                dividerLine: 'bg-border',
                dividerText: 'text-foreground font-medium',
              },
            }}
            routing="path"
            path="/signup"
            signInUrl="/login"
          />
        </Card>
      </div>
    </div>
  );
};

export default Signup;
