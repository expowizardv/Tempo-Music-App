import { Music } from 'lucide-react';
import type { RatedSong } from '../types';

interface RatingsListProps {
  ratings: RatedSong[];
}

export function RatingsList({ ratings }: RatingsListProps) {
  if (ratings.length === 0) {
    return (
      <div className="text-center text-gray-400">
        You haven't rated any songs yet
      </div>
    );
  }

  return (
    <div className="grid gap-4 max-w-4xl mx-auto">
      {ratings.map((song) => (
        <div
          key={`${song.id}-${song.rated_at}`}
          className="flex items-center gap-4 bg-white/5 p-4 rounded-lg"
        >
          {song.albumArt ? (
            <img
              src={song.albumArt}
              alt={song.album}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Music className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{song.name}</h3>
            <p className="text-sm text-gray-400 truncate">
              {song.artist} • {song.album}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-sm font-medium">
              {song.rating}/5
            </div>
            <div className="text-sm text-gray-400 hidden sm:block">
              {new Date(song.rated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}