import { Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PricingProps {
  onStart: () => void;
}

export function Pricing({ onStart }: PricingProps) {
  const { user } = useAuth();

  const handleUpgrade = () => {
    if (!user) {
      onStart(); // Show auth modal
      return;
    }
    window.location.href = 'https://buy.stripe.com/28odSr6pkczO00gaEE';
  };

  return (
    <section className="py-32 bg-black/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400">Choose the plan that fits your needs</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-gray-400 mb-6">Perfect for getting started</p>
            <div className="text-3xl font-bold mb-8">€0 <span className="text-lg font-normal text-gray-400">/month</span></div>
            
            <ul className="space-y-4 mb-8">
              {freePlanFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onStart}
              className="w-full py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors font-medium"
            >
              Get Started
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-2xl p-8 border border-orange-500/20 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-sm font-medium px-4 py-1 rounded-full">
              RECOMMENDED
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <p className="text-gray-400 mb-6">For serious music lovers</p>
            <div className="text-3xl font-bold mb-8">€4.99 <span className="text-lg font-normal text-gray-400">/month</span></div>
            
            <ul className="space-y-4 mb-8">
              {premiumPlanFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-400 transition-colors font-medium"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const freePlanFeatures = [
  'Rate up to 5 songs per day',
  'Basic analytics',
  'Track your music journey',
  'Create your collection',
];

const premiumPlanFeatures = [
  'Unlimited song ratings',
  'Detailed analytics and insights',
  'Custom rating categories',
  'Export your data',
  'Priority support',
  'Early access to new features',
];