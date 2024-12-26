import { BarChart2 } from 'lucide-react';
import type { RatedSong } from '../../types';

interface RatingDistributionProps {
  ratings: RatedSong[];
}

export function RatingDistribution({ ratings }: RatingDistributionProps) {
  return (
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
  );
}