import { Music2, Star } from 'lucide-react';
import type { RatedSong } from '../../types';

interface BasicAccountProps {
  ratings: RatedSong[];
}

export function BasicAccount({ ratings }: BasicAccountProps) {
  const handleUpgrade = () => {
    window.location.href = 'https://buy.stripe.com/28odSr6pkczO00gaEE';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Ratings</h1>
        <button
          onClick={handleUpgrade}
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white rounded-full font-medium transition-all transform hover:scale-105"
        >
          Upgrade to Premium
        </button>
      </div>

      {ratings.length === 0 ? (
        <div className="text-center py-12">
          <Music2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No ratings yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Start rating songs to build your collection
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ratings.map((song) => (
            <div
              key={`${song.id}-${song.rated_at}`}
              className="flex items-center gap-4 bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {song.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {song.artist} • {song.album}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-indigo-500 fill-indigo-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {song.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-8 border border-indigo-500/20">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Upgrade to Premium
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Get unlimited ratings, detailed analytics, and more with Premium.
        </p>
        <button
          onClick={handleUpgrade}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white py-3 rounded-xl font-medium transition-all transform hover:scale-105"
        >
          Get Premium Now
        </button>
      </div>
    </div>
  );
}