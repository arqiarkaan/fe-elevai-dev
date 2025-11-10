import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureLayoutProps {
  children: ReactNode;
  onBack: () => void;
  categoryLabel: string;
}

export const FeatureLayout = ({ children, onBack, categoryLabel }: FeatureLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-6 hover:border-primary/50 transition-smooth"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke {categoryLabel}
      </Button>
      <Card className="p-6 md:p-8 gradient-card border-border/50">
        {children}
      </Card>
    </div>
  );
};
