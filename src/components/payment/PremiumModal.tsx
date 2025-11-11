import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crown, Check, Sparkles, Loader2 } from 'lucide-react';
import { paymentApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';
import type { MidtransPaymentResult } from '@/types/midtrans';

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SubscriptionPlan {
  name: string;
  duration: string;
  price: number;
  tokens: number;
  description: string;
  isBestValue: boolean;
}

export function PremiumModal({ open, onOpenChange }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
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
    mutationFn: (data: { type: 'subscription'; item: string; amount: number; tokens_amount?: number }) =>
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
            onSuccess: function (result: MidtransPaymentResult) {
              console.log('Payment success:', result);
              setIsSnapOpen(false);
              toast.success('Pembayaran berhasil! Premium Anda akan segera aktif.');
              refreshProfile();
            },
            onPending: function (result: MidtransPaymentResult) {
              console.log('Payment pending:', result);
              setIsSnapOpen(false);
              toast.info('Pembayaran pending. Silakan selesaikan pembayaran Anda.');
            },
            onError: function (result: MidtransPaymentResult) {
              console.error('Payment error:', result);
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

  const handleSelectPlan = (planKey: string, plan: SubscriptionPlan) => {
    setSelectedPlan(planKey);
    createPaymentMutation.mutate({
      type: 'subscription',
      item: planKey,
      amount: plan.price,
      tokens_amount: plan.tokens,
    });
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')},-`;
  };

  const subscriptions = plansData?.data?.subscriptions || {};
  const subscriptionEntries = Object.entries(subscriptions) as [string, SubscriptionPlan][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full p-4 sm:p-6"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <DialogTitle className="text-lg sm:text-2xl">Pilih Langganan Premium</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-4 sm:mt-6">
          {plansLoading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {subscriptionEntries.map(([key, plan]) => (
                <Card
                  key={key}
                  className={`relative p-4 sm:p-6 hover:shadow-lg transition-all ${
                    plan.isBestValue ? 'border-primary border-2' : ''
                  }`}
                >
                  {plan.isBestValue && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Pilihan Terbaik
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="p-2 sm:p-3 rounded-full bg-primary/10">
                      <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">{plan.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    <div className="text-2xl sm:text-3xl font-bold text-primary">
                      {formatPrice(plan.price)}
                    </div>

                    <div className="w-full space-y-2 text-sm text-left">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span>Akses semua fitur premium</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span>Bonus {plan.tokens} token</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span>Berlaku {plan.duration === 'monthly' ? '30 hari' : '365 hari'}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      variant={plan.isBestValue ? 'default' : 'outline'}
                      onClick={() => handleSelectPlan(key, plan)}
                      disabled={(createPaymentMutation.isPending && selectedPlan === key) || isSnapOpen}
                    >
                      {createPaymentMutation.isPending && selectedPlan === key ? (
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
                          <Crown className="w-4 h-4" />
                          Pilih & Bayar
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
