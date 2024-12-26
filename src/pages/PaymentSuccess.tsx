import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { handleCheckoutSuccess } from '../lib/stripe';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    async function processPayment() {
      try {
        await handleCheckoutSuccess(sessionId);
        // Wait a moment before redirecting to ensure the user sees the success message
        setTimeout(() => navigate('/account'), 2000);
      } catch (err) {
        setError('Failed to process payment. Please contact support.');
      }
    }

    processPayment();
  }, [sessionId, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/account')}
            className="text-orange-500 hover:underline"
          >
            Return to Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-400">Welcome to Tempo Premium</p>
      </div>
    </div>
  );
}