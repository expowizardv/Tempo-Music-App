import { X } from 'lucide-react';
import { useState } from 'react';
import { type Song } from '../types';

interface RatingModalProps {
  song: Song;
  onClose: () => void;
  onRate: (ratings: Record<string, number>) => Promise<void>;
}

const RATING_CATEGORIES = {
  melody: 'Melody',
  lyrics: 'Lyrics',
  production: 'Production',
  originality: 'Originality',
};

export function RatingModal({ song, onClose, onRate }: RatingModalProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async () => {
    setIsSubmitting(true);
    await onRate(ratings);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Rate Song</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">{song.name}</h3>
          <p className="text-sm text-gray-400">
            {song.artist} • {song.album}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {Object.entries(RATING_CATEGORIES).map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium mb-2 block">
                {label}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRatings((prev) => ({ ...prev, [key]: value }))}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      ratings[key] === value
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleRate}
          disabled={Object.keys(ratings).length !== Object.keys(RATING_CATEGORIES).length || isSubmitting}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 py-2 rounded-full font-medium transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </button>
      </div>
    </div>
  );
}