import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CreditCard, ArrowLeft, Sparkles } from 'lucide-react';
import { createCheckoutSession, getStripe } from '../../lib/stripe';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

export function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to continue', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Payment system is not available');
      }

      const sessionId = await createCheckoutSession(user.id);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      showToast(
        err instanceof Error ? err.message : 'Payment setup failed. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-8 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Upgrade to Premium</h1>
            <p className="text-gray-400">One-time payment • Lifetime access</p>
          </div>
        </div>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <CreditCard className="h-6 w-6 text-indigo-500 mt-1" />
            <div>
              <h3 className="font-medium mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-400">
                Your payment is processed securely through Stripe
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-indigo-500 mt-1" />
            <div>
              <h3 className="font-medium mb-1">Money-Back Guarantee</h3>
              <p className="text-sm text-gray-400">
                Not satisfied? Get a full refund within 30 days
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Tempo Premium (Lifetime)</span>
            <span className="text-3xl font-bold">€5.99</span>
          </div>
          <ul className="space-y-2 mb-8">
            {features.map((feature) => (
              <li key={feature} className="text-sm text-gray-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50 disabled:hover:from-indigo-500 disabled:hover:to-purple-500 py-4 rounded-xl font-medium transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 text-lg"
          >
            {isLoading ? 'Processing...' : 'Get Premium Now'}
          </button>
        </form>
      </div>
    </div>
  );
}

const features = [
  'Unlimited song ratings',
  'Detailed analytics and insights',
  'Custom rating categories',
  'Export your data',
  'Priority support',
  'Early access to new features',
];