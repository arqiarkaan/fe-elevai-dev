import { Card } from './ui/card';
import { Button } from './ui/button';
import { Copy, RotateCw, X, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { MarkdownRenderer } from './MarkdownRenderer';
import { RegenerateConfirmModal } from './RegenerateConfirmModal';
import { useUserStore } from '@/lib/user-store';
import { useState, useEffect, useRef } from 'react';

interface GeneratedResultCardProps {
  result: string;
  onCopy: () => void;
  onRegenerate: () => void;
  onReset: () => void;
  isRegenerating?: boolean;
  requiredTokens?: number;
}

export const GeneratedResultCard = ({
  result,
  onCopy,
  onRegenerate,
  onReset,
  isRegenerating = false,
  requiredTokens = 1,
}: GeneratedResultCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { profile } = useUserStore();

  const handleRegenerateClick = () => {
    setShowModal(true);
  };

  const handleConfirmRegenerate = () => {
    setShowModal(false);
    onRegenerate();
  };

  const handleCancelRegenerate = () => {
    setShowModal(false);
  };

  return (
    <>
      <Card className="p-6 bg-card/50 border-border/50 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-primary">Hasil Generate</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCopy}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerateClick}
              disabled={isRegenerating}
            >
              <RotateCw
                className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`}
              />
              Regenerate
            </Button>
            <Button variant="outline" size="sm" onClick={onReset}>
              <X className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        <MarkdownRenderer>{result}</MarkdownRenderer>
      </Card>

      <RegenerateConfirmModal
        isOpen={showModal}
        onConfirm={handleConfirmRegenerate}
        onCancel={handleCancelRegenerate}
        currentBalance={profile?.tokens || 0}
        requiredTokens={requiredTokens}
      />
    </>
  );
};

interface LoadingStateCardProps {
  message?: string;
}

export const LoadingStateCard = ({
  message = 'ElevAI sedang menggenerate...',
}: LoadingStateCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the loading card when it appears
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <Card
      ref={cardRef}
      className="p-6 bg-card/50 border-border/50 animate-fade-in"
    >
      <div className="flex items-center gap-4">
        <Bot className="w-8 h-8 text-primary flex-shrink-0" />
        <div className="flex-1">
          <p className="text-lg font-medium">{message}</p>
        </div>
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </Card>
  );
};
