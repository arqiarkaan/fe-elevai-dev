import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Coins, Sparkles, Loader2 } from 'lucide-react';
import { paymentApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';

interface TokenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TokenPackage {
  name: string;
  amount: number;
  price: number;
  description: string;
  isBestValue: boolean;
}

const TOKEN_PRICE_PER_UNIT = 1499;
const MIN_CUSTOM_TOKENS = 5;

export function TokenModal({ open, onOpenChange }: TokenModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isSnapOpen, setIsSnapOpen] = useState(false);
  const { refreshProfile } = useUserStore();

  // Fetch plans
  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: ['payment-plans'],
    queryFn: () => paymentApi.getPlans(),
    enabled: open,
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: (data: { type: 'tokens'; item: string; amount: number; tokens_amount: number }) =>
      paymentApi.createPayment(data),
    onSuccess: (response) => {
      if (response.success && response.data.snap_token) {
        // Prevent double calls
        if (isSnapOpen) {
          console.warn('Midtrans popup is already open');
          return;
        }

        // Set flag before opening popup
        setIsSnapOpen(true);
        
        // Close the modal first to prevent z-index issues
        onOpenChange(false);
        
        // Small delay to ensure modal closes before opening Midtrans popup
        setTimeout(() => {
          // Open Midtrans SNAP popup
          window.snap.pay(response.data.snap_token, {
            onSuccess: function () {
              setIsSnapOpen(false);
              toast.success('Pembayaran berhasil! Token Anda akan segera ditambahkan.');
              refreshProfile();
              setCustomAmount('');
            },
            onPending: function () {
              setIsSnapOpen(false);
              toast.info('Pembayaran pending. Silakan selesaikan pembayaran Anda.');
            },
            onError: function () {
              setIsSnapOpen(false);
              toast.error('Pembayaran gagal. Silakan coba lagi.');
            },
            onClose: function () {
              console.log('Payment popup closed');
              setIsSnapOpen(false);
            },
          });
        }, 300);
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Gagal membuat pembayaran');
      setIsSnapOpen(false);
    },
  });

  const handleSelectPackage = (packageKey: string, pkg: TokenPackage) => {
    setSelectedPackage(packageKey);
    createPaymentMutation.mutate({
      type: 'tokens',
      item: packageKey,
      amount: pkg.price,
      tokens_amount: pkg.amount,
    });
  };

  const handleCustomPurchase = () => {
    const amount = parseInt(customAmount);
    if (amount < MIN_CUSTOM_TOKENS) {
      toast.error(`Minimal pembelian ${MIN_CUSTOM_TOKENS} token`);
      return;
    }

    const price = calculateCustomPrice(amount);
    setSelectedPackage('custom');
    createPaymentMutation.mutate({
      type: 'tokens',
      item: 'custom',
      amount: price,
      tokens_amount: amount,
    });
  };

  const calculateCustomPrice = (amount: number): number => {
    if (amount < MIN_CUSTOM_TOKENS) return 0;
    // Base price for 5 tokens is 7495
    // Each additional token costs 1499
    const basePrice = 7495;
    const additionalTokens = amount - MIN_CUSTOM_TOKENS;
    return basePrice + (additionalTokens * TOKEN_PRICE_PER_UNIT);
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')},-`;
  };

  const customAmountNum = parseInt(customAmount) || 0;
  const customPrice = calculateCustomPrice(customAmountNum);
  const isCustomValid = customAmountNum >= MIN_CUSTOM_TOKENS;

  const tokens = plansData?.data?.tokens || {};
  const tokenEntries = Object.entries(tokens) as [string, TokenPackage][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[85vh] overflow-y-auto w-[95vw] sm:w-full p-4 sm:p-6"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <DialogTitle className="text-lg sm:text-2xl">Beli Token</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
          {/* Token Packages */}
          {plansLoading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {tokenEntries.map(([key, pkg]) => (
                <Card
                  key={key}
                  className={`relative p-4 sm:p-6 hover:shadow-lg transition-all ${
                    pkg.isBestValue ? 'border-primary border-2' : ''
                  }`}
                >
                  {pkg.isBestValue && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Pilihan Terbaik
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="p-2 sm:p-3 rounded-full bg-primary/10">
                      <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">{pkg.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{pkg.description}</p>
                    </div>

                    <div className="text-2xl sm:text-3xl font-bold text-primary">
                      {formatPrice(pkg.price)}
                    </div>

                    <Button
                      className="w-full"
                      variant={pkg.isBestValue ? 'default' : 'outline'}
                      onClick={() => handleSelectPackage(key, pkg)}
                      disabled={(createPaymentMutation.isPending && selectedPackage === key) || isSnapOpen}
                    >
                      {createPaymentMutation.isPending && selectedPackage === key ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Memproses...
                        </>
                      ) : isSnapOpen ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Popup Terbuka...
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4" />
                          Pilih & Bayar
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Custom Amount Section */}
          <div className="border-t pt-6 sm:pt-8">
            <Card className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">Beli Jumlah Lain?</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Beli token sesuai jumlah yang Anda butuhkan.
                  </p>
                </div>

                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Jumlah"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    min={MIN_CUSTOM_TOKENS}
                    className="pr-20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Token
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Minimal {MIN_CUSTOM_TOKENS} token</span>
                  {customAmountNum > 0 && (
                    <span className="font-semibold">
                      Estimasi: {formatPrice(customPrice)}
                    </span>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={handleCustomPurchase}
                  disabled={!isCustomValid || (createPaymentMutation.isPending && selectedPackage === 'custom') || isSnapOpen}
                >
                  {createPaymentMutation.isPending && selectedPackage === 'custom' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses...
                    </>
                  ) : isSnapOpen ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Popup Terbuka...
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      Pilih & Bayar
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
