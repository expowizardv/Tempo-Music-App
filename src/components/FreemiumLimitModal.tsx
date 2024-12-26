import { Sparkles, X } from 'lucide-react';

interface FreemiumLimitModalProps {
  onClose: () => void;
}

export function FreemiumLimitModal({ onClose }: FreemiumLimitModalProps) {
  const handleUpgrade = () => {
    window.location.href = 'https://buy.stripe.com/28odSr6pkczO00gaEE';
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-8 max-w-lg w-full relative animate-slide-up border border-white/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white animate-pulse-glow" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Unlock Unlimited Ratings!</h2>
          <p className="text-gray-400">You've reached the free plan limit. Upgrade to Premium to continue your musical journey!</p>
        </div>

        <div className="bg-white/5 rounded-xl p-6 mb-8">
          <h3 className="font-semibold mb-4">Premium Features</h3>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold mb-2">€5.99</div>
          <div className="text-sm text-gray-400 mb-6">One-time payment • Lifetime access</div>
          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 py-4 rounded-xl font-medium transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20"
          >
            Get Premium Now
          </button>
        </div>
      </div>
    </div>
  );
}

const features = [
  "Unlimited song and album ratings",
  "Detailed analytics and insights",
  "Custom rating categories",
  "Export your data",
  "Priority support",
  "Early access to new features",
];