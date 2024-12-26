import { Clock } from 'lucide-react';
import type { RatedSong } from '../../types';
import { calculateTimeOfDayStats } from '../../utils/analytics';

interface TimePatternsProps {
  ratings: RatedSong[];
}

export function TimePatterns({ ratings }: TimePatternsProps) {
  const { favoriteTime } = calculateTimeOfDayStats(ratings);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-orange-500 mb-2">
        <Clock className="h-5 w-5" />
        <h4 className="font-medium">Rating Patterns</h4>
      </div>
      <p className="text-gray-300">
        You rate music most often in the {favoriteTime}
      </p>
    </div>
  );
}