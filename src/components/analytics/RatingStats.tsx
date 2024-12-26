import { type RatedSong } from '../../types';
import { BarChart2, Music, Star, TrendingUp } from 'lucide-react';

interface RatingStatsProps {
  ratings: RatedSong[];
}

export function RatingStats({ ratings }: RatingStatsProps) {
  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, song) => sum + song.rating, 0) / ratings.length).toFixed(1)
    : '0.0';

  const recentTrend = ratings.slice(0, 5).reduce((sum, song) => sum + song.rating, 0) / 5;
  const totalTrend = ratings.reduce((sum, song) => sum + song.rating, 0) / ratings.length;
  const trendDirection = recentTrend > totalTrend ? 'up' : 'down';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Music className="h-5 w-5 text-orange-500" />
          <h3 className="font-medium">Total Ratings</h3>
        </div>
        <p className="text-3xl font-bold">{ratings.length}</p>
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Star className="h-5 w-5 text-orange-500" />
          <h3 className="font-medium">Average Rating</h3>
        </div>
        <p className="text-3xl font-bold">{averageRating}</p>
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h3 className="font-medium">Recent Trend</h3>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold">
            {recentTrend.toFixed(1)}
          </p>
          <span className={`text-sm ${
            trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            {trendDirection === 'up' ? '↑' : '↓'}
          </span>
        </div>
      </div>
    </div>
  );
}