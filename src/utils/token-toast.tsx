import { toast } from 'sonner';
import { Coins } from 'lucide-react';

/**
 * Show a toast notification for token consumption
 * @param previousBalance - Token balance BEFORE the operation
 * @param newBalance - Token balance AFTER the operation
 */
export function showTokenConsumptionToast(
  previousBalance: number,
  newBalance: number
) {
  // Calculate actual tokens used from the difference
  const tokensUsed = previousBalance - newBalance;

  // Validate the calculation
  if (tokensUsed < 0) {
    console.error('Invalid token calculation:', {
      previousBalance,
      newBalance,
      tokensUsed,
    });
    return;
  }

  toast.success(
    <div className="flex items-start gap-3">
      <Coins className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold">Token Berhasil Digunakan</p>
        <p className="text-sm text-muted-foreground">
          Kamu menggunakan <span className="font-bold">{tokensUsed} token</span>{' '}
          untuk fitur ini
        </p>
        <p className="text-sm text-muted-foreground">
          Sisa token:{' '}
          <span className="font-bold text-yellow-600">{newBalance}</span>
        </p>
      </div>
    </div>,
    {
      duration: 5000,
    }
  );
}
