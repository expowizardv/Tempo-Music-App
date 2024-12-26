import { Star } from 'lucide-react';

interface RatingPreviewProps {
  song: {
    name: string;
    artist: string;
    album: string;
    rating: number;
  };
}

export function RatingPreview({ song }: RatingPreviewProps) {
  return (
    <div className="relative group">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transform transition-transform duration-500 hover:scale-105">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Now Rating</div>
            <h3 className="text-2xl font-bold">{song.name}</h3>
            <p className="text-gray-400">{song.artist} • {song.album}</p>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 ${
                  star <= song.rating
                    ? 'fill-indigo-500 text-indigo-500'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{category.name}</span>
                  <span className="text-indigo-400">{category.value}/5</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(category.value / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

const categories = [
  { name: 'Melody', value: 4.5 },
  { name: 'Lyrics', value: 4.8 },
  { name: 'Production', value: 4.2 },
  { name: 'Originality', value: 4.7 }
];