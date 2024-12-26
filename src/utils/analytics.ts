import type { RatedSong } from '../types';

export function calculateTimeOfDayStats(ratings: RatedSong[]) {
  const timeOfDayRatings = ratings.reduce((acc, song) => {
    const hour = new Date(song.rated_at).getHours();
    const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    acc[period] = (acc[period] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    favoriteTime: Object.entries(timeOfDayRatings).reduce((a, b) => b[1] > a[1] ? b : a)[0],
    distribution: timeOfDayRatings
  };
}

export function calculateRatingTrends(ratings: RatedSong[]) {
  const recentAvg = ratings.slice(0, 5).reduce((sum, song) => sum + song.rating, 0) / 5;
  const totalAvg = ratings.reduce((sum, song) => sum + song.rating, 0) / ratings.length;

  return {
    recentAverage: recentAvg,
    totalAverage: totalAvg,
    trend: recentAvg > totalAvg + 0.5 ? 'up' : recentAvg < totalAvg - 0.5 ? 'down' : 'stable'
  };
}