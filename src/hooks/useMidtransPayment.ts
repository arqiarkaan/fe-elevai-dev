import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { paymentApi } from '@/lib/api';
import { useUserStore } from '@/lib/user-store';
import type { MidtransPaymentResult } from '@/types/midtrans';

interface PaymentData {
  type: 'subscription' | 'tokens';
  item: string;
  amount: number;
  tokens_amount?: number;
}

/**
 * Reusable hook for handling Midtrans payment flow
 * Reduces duplication between PremiumModal and TokenModal
 */
export function useMidtransPayment(onModalClose: () => void) {
  const [isSnapOpen, setIsSnapOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { refreshProfile } = useUserStore();

  const createPaymentMutation = useMutation({
    mutationFn: (data: PaymentData) => paymentApi.createPayment(data),
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
        onModalClose();

        // Small delay to ensure modal closes before opening Midtrans popup
        setTimeout(() => {
          openMidtransPopup(response.data.snap_token);
        }, 300);
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Gagal membuat pembayaran'
      );
      setIsSnapOpen(false);
      setSelectedItem(null);
    },
  });

  const openMidtransPopup = useCallback(
    (snapToken: string) => {
      window.snap.pay(snapToken, {
        onSuccess: (result: MidtransPaymentResult) => {
          console.log('Payment success:', result);
          setIsSnapOpen(false);
          setSelectedItem(null);
          toast.success('Pembayaran berhasil!');
          refreshProfile();
        },
        onPending: (result: MidtransPaymentResult) => {
          console.log('Payment pending:', result);
          setIsSnapOpen(false);
          setSelectedItem(null);
          toast.info('Pembayaran pending. Silakan selesaikan pembayaran Anda.');
        },
        onError: (result: MidtransPaymentResult) => {
          console.error('Payment error:', result);
          setIsSnapOpen(false);
          setSelectedItem(null);
          toast.error('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: () => {
          console.log('Payment popup closed');
          setIsSnapOpen(false);
          setSelectedItem(null);
        },
      });
    },
    [refreshProfile]
  );

  const initiatePayment = useCallback(
    (itemId: string, paymentData: PaymentData) => {
      setSelectedItem(itemId);
      createPaymentMutation.mutate(paymentData);
    },
    [createPaymentMutation]
  );

  return {
    isSnapOpen,
    selectedItem,
    isProcessing: createPaymentMutation.isPending,
    initiatePayment,
  };
}
