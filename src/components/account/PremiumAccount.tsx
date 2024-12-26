import { useState } from 'react';
import { Share2, Download } from 'lucide-react';
import { RatingsList } from '../RatingsList';
import { RatingStats } from '../analytics/RatingStats';
import { RatingInsights } from '../analytics/RatingInsights';
import { ShareRatingsModal } from '../ShareRatingsModal';
import type { RatedSong } from '../../types';

interface PremiumAccountProps {
  ratings: RatedSong[];
}

export function PremiumAccount({ ratings }: PremiumAccountProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  const handleExport = () => {
    const data = ratings.map(rating => ({
      song: rating.name,
      artist: rating.artist,
      album: rating.album,
      rating: rating.rating,
      date: new Date(rating.rated_at).toLocaleDateString()
    }));

    const csv = [
      ['Song', 'Artist', 'Album', 'Rating', 'Date'],
      ...data.map(row => [row.song, row.artist, row.album, row.rating, row.date])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tempo-ratings.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Music Journey
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      
      <RatingStats ratings={ratings} />
      <RatingInsights ratings={ratings} />

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Rating History
        </h2>
        <RatingsList ratings={ratings} />
      </div>

      {showShareModal && (
        <ShareRatingsModal
          ratings={ratings}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}