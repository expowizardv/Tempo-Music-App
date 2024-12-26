import { Sparkles } from 'lucide-react';

interface PremiumBannerProps {
  message: string;
  onUpgrade: () => void;
}

export function PremiumBanner({ message, onUpgrade }: PremiumBannerProps) {
  return (
    <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-orange-500" />
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={onUpgrade}
        className="px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded-full text-sm font-medium transition-colors"
      >
        Upgrade to Premium
      </button>
    </div>
  );
}