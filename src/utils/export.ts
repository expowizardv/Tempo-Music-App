import type { RatedSong } from '../types';

export function exportToCsv(ratings: RatedSong[]): void {
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
}