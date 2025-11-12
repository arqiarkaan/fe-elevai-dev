import { Button } from '@/components/ui/button';
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
import { AlertTriangle, RotateCw, Coins } from 'lucide-react';

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
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Konfirmasi Regenerate
          </AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin regenerate hasil ini?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 p-4 rounded-md space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Token yang dibutuhkan:</span>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">{requiredTokens}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Token Anda saat ini:</span>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">{currentBalance}</span>
            </div>
          </div>
          {currentBalance < requiredTokens && (
            <p className="text-sm text-destructive font-medium pt-2 border-t">
              ⚠️ Token Anda tidak cukup! Butuh {requiredTokens - currentBalance}{' '}
              token lagi.
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={currentBalance < requiredTokens}
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Regenerate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
