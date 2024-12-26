import { BarChart2, TrendingUp, Clock } from 'lucide-react';
import { type RatedSong } from '../../types';

interface RatingInsightsProps {
  ratings: RatedSong[];
}

export function RatingInsights({ ratings }: RatingInsightsProps) {
  if (ratings.length === 0) return null;

  // Calculate favorite genres/styles based on ratings
  const topRated = ratings.filter(song => song.rating >= 4);
  const recentHighRatings = topRated.slice(0, 3);

  // Generate insights based on rating patterns
  const generateInsight = () => {
    const recentAvg = ratings.slice(0, 5).reduce((sum, song) => sum + song.rating, 0) / 5;
    const totalAvg = ratings.reduce((sum, song) => sum + song.rating, 0) / ratings.length;

    if (recentAvg > totalAvg + 0.5) {
      return "You've been discovering more music you love lately!";
    } else if (recentAvg < totalAvg - 0.5) {
      return "You seem to be exploring new musical territories.";
    }
    return "Your musical taste has been consistent recently.";
  };

  // Calculate rating frequency by time of day
  const timeOfDayRatings = ratings.reduce((acc, song) => {
    const hour = new Date(song.rated_at).getHours();
    const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    acc[period] = (acc[period] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const favoriteTime = Object.entries(timeOfDayRatings).reduce((a, b) => 
    b[1] > a[1] ? b : a
  )[0];

  return (
    <div className="bg-white/5 rounded-xl p-6 mb-12">
      <h3 className="text-xl font-semibold mb-6">Your Music Story</h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <TrendingUp className="h-5 w-5" />
            <h4 className="font-medium">Recent Trend</h4>
          </div>
          <p className="text-gray-300">{generateInsight()}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <BarChart2 className="h-5 w-5" />
            <h4 className="font-medium">Rating Distribution</h4>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(rating => {
              const count = ratings.filter(s => s.rating === rating).length;
              const percentage = (count / ratings.length) * 100;
              return (
                <div key={rating} className="flex-1">
                  <div className="h-24 bg-white/10 rounded-t-lg relative">
                    <div
                      className="absolute bottom-0 w-full bg-orange-500 rounded-t-lg"
                      style={{ height: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-center text-sm mt-2">{rating}★</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <Clock className="h-5 w-5" />
            <h4 className="font-medium">Rating Patterns</h4>
          </div>
          <p className="text-gray-300">
            You rate music most often in the {favoriteTime}
          </p>
        </div>
      </div>
    </div>
  );
}