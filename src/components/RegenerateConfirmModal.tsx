import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface RegenerateConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  currentBalance: number;
  requiredTokens: number;
}

export const RegenerateConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  currentBalance,
  requiredTokens,
}: RegenerateConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 bg-card border-border shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold">Konfirmasi Regenerate</h3>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Apakah Anda yakin ingin regenerate hasil ini?
        </p>
        
        <div className="bg-muted/50 p-3 rounded-md mb-4">
          <p className="text-sm">
            <strong>Token yang dibutuhkan:</strong> {requiredTokens} tokens
          </p>
          <p className="text-sm">
            <strong>Token Anda saat ini:</strong> {currentBalance} tokens
          </p>
          {currentBalance < requiredTokens && (
            <p className="text-sm text-destructive mt-2">
              ⚠️ Token Anda tidak cukup! Butuh {requiredTokens - currentBalance} token lagi.
            </p>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            className="flex-1"
          >
            Batal
          </Button>
          <Button 
            onClick={onConfirm} 
            className="flex-1"
            disabled={currentBalance < requiredTokens}
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </Card>
    </div>
  );
};
