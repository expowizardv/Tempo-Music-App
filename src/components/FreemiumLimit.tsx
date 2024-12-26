import { Lock } from 'lucide-react';

interface FreemiumLimitProps {
  onUpgrade: () => void;
  message: string;
}

export function FreemiumLimit({ onUpgrade, message }: FreemiumLimitProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Lock className="h-12 w-12 text-orange-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
      <p className="text-gray-400 mb-6 max-w-md">{message}</p>
      <button
        onClick={() => window.location.href = 'https://buy.stripe.com/28odSr6pkczO00gaEE'}
        className="px-6 py-2 bg-orange-500 hover:bg-orange-400 rounded-full transition-colors"
      >
        Upgrade to Premium (€4.99)
      </button>
    </div>
  );
}