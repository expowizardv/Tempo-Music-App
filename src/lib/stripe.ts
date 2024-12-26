import { loadStripe } from '@stripe/stripe-js';

// Get Stripe public key from environment variables
const STRIPE_PUBLIC_KEY = 'pk_live_51QaFLFDefH1ZaGPqJ06TagbCawHOQts8XviK2SlRymBQLqo383sjfuRfzIJQfWSHYIcRAcDp5RcR6H0aUZZYcMXW00KTE1XE7S';

let stripePromise: Promise<any> | null = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
}

export async function createCheckoutSession(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { userId },
    });

    if (error) {
      console.error('Checkout session creation failed:', error);
      throw new Error('Failed to start checkout process');
    }

    if (!data?.sessionId) {
      throw new Error('Invalid response from server');
    }

    return data.sessionId;
  } catch (err) {
    console.error('Error creating checkout session:', err);
    throw new Error('Payment setup failed. Please try again later.');
  }
}

export async function handleCheckoutSuccess(sessionId: string): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('handle-checkout-success', {
      body: { sessionId },
    });

    if (error) {
      console.error('Payment verification failed:', error);
      throw new Error('Could not verify payment');
    }
  } catch (err) {
    console.error('Error handling checkout success:', err);
    throw new Error('Payment verification failed. Please contact support.');
  }
}