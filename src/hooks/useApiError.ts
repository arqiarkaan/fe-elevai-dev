import { toast } from 'sonner';

/**
 * Standard API Error Response
 */
export interface ApiError {
  error?: string;
  message?: string;
  current_balance?: number;
  need_to_purchase?: number;
}

/**
 * Hook for handling API errors consistently across the application
 */
export function useApiError() {
  const handleError = (
    error: unknown,
    customMessages?: {
      insufficientTokens?: string;
      premiumRequired?: string;
      default?: string;
    }
  ) => {
    console.error('API Error:', error);

    const err = error as ApiError;
    let errorMessage = customMessages?.default || 'Terjadi kesalahan';

    // Extract error message from various formats
    if (typeof err?.error === 'string') {
      errorMessage = err.error;
    } else if (err?.message) {
      errorMessage = err.message;
    }

    // Handle specific error types
    if (
      errorMessage === 'Insufficient tokens' ||
      errorMessage.includes('Insufficient tokens')
    ) {
      const message =
        customMessages?.insufficientTokens ||
        `Token anda kurang (${err.current_balance || 0}). Butuh ${
          err.need_to_purchase || 0
        } token lagi.`;
      toast.error(message);
    } else if (
      errorMessage === 'Premium subscription required' ||
      errorMessage.includes('Premium subscription')
    ) {
      const message =
        customMessages?.premiumRequired ||
        'Fitur ini memerlukan langganan premium';
      toast.error(message);
    } else {
      toast.error(errorMessage);
    }
  };

  return { handleError };
}
