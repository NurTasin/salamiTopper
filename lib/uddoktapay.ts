const API_KEY = process.env.UDDOKTAPAY_API_KEY;
const BASE_URL = process.env.UDDOKTAPAY_BASE_URL;

if (!API_KEY || !BASE_URL) {
  console.warn('UddoktaPay environment variables are missing');
}

export interface PaymentRequest {
  full_name: string;
  email: string;
  amount: number;
  metadata: Record<string, unknown>;
  redirect_url: string;
  cancel_url: string;
  webhook_url: string;
  return_type: 'GET' | 'POST';
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  payment_url?: string;
}

export interface VerifyResponse {
  status: string;
  amount: string;
  charge: string;
  payment_method: string;
  sender_number: string;
  transaction_id: string;
  order_id: string;
  metadata: Record<string, unknown>;
}

export async function initiatePayment(data: PaymentRequest): Promise<PaymentResponse> {
  try {
    const response = await fetch(`${BASE_URL}/checkout-v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': API_KEY!,
      },
      body: JSON.stringify({
        full_name: data.full_name,
        email: data.email,
        amount: data.amount,
        metadata: data.metadata,
        redirect_url: data.redirect_url,
        cancel_url: data.cancel_url,
        webhook_url: data.webhook_url,
        return_type: data.return_type,
      }),
    });

    const text = await response.text();
    console.log('UddoktaPay Initiate Response:', text);

    try {
      return JSON.parse(text);
    } catch {
      return { status: false, message: 'Invalid response from payment gateway' };
    }
  } catch (error) {
    console.error('UddoktaPay Initiate Error:', error);
    return { status: false, message: 'Connection to payment gateway failed' };
  }
}

export async function verifyPayment(invoice_id: string): Promise<VerifyResponse> {
  const response = await fetch(`${BASE_URL}/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'RT-UDDOKTAPAY-API-KEY': API_KEY!,
    },
    body: JSON.stringify({
      invoice_id,
    }),
  });

  const text = await response.text();
  console.log('UddoktaPay Verify Response:', text);
  return JSON.parse(text);
}
