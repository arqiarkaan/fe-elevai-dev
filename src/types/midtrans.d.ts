// Midtrans SNAP types
export interface MidtransPaymentResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
}

export interface MidtransSnapOptions {
  onSuccess?: (result: MidtransPaymentResult) => void;
  onPending?: (result: MidtransPaymentResult) => void;
  onError?: (result: MidtransPaymentResult) => void;
  onClose?: () => void;
}

export interface MidtransSnap {
  pay: (snapToken: string, options: MidtransSnapOptions) => void;
}

declare global {
  interface Window {
    snap: MidtransSnap;
  }
}

export {};
