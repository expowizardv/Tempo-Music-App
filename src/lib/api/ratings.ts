import { supabase } from '../supabase';
import type { Song, RatedSong } from '../../types';
import { RATING_CATEGORIES, type RatingCategory } from '../../types/ratings';

export async function submitRating(
  song: Song,
  ratings: Record<RatingCategory, number>
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('You must be logged in to submit ratings');
  }

  // Validate song data
  if (!song?.id || !song?.name || !song?.artist || !song?.albumId || !song?.album) {
    throw new Error('Invalid song data');
  }

  // Validate ratings
  const requiredCategories = Object.keys(RATING_CATEGORIES) as RatingCategory[];
  const hasAllCategories = requiredCategories.every(
    (category) => typeof ratings[category] === 'number' && ratings[category] >= 1 && ratings[category] <= 5
  );

  if (!hasAllCategories) {
    throw new Error('All rating categories must have values between 1 and 5');
  }

  // Calculate average rating
  const averageRating = Math.round(
    Object.values(ratings).reduce((sum, val) => sum + val, 0) / 
    Object.values(ratings).length
  );

  // Update album artwork if available
  if (song.albumArt) {
    await supabase.rpc('update_album_artwork', {
      p_spotify_id: song.albumId,
      p_album_art: song.albumArt
    });
  }

  const { error } = await supabase.rpc('upsert_song_and_rate', {
    p_spotify_id: song.id,
    p_name: song.name,
    p_artist: song.artist,
    p_album_id: song.albumId,
    p_album_name: song.album,
    p_album_artist: song.artist,
    p_album_release_date: null,
    p_rating: averageRating
  });

  if (error) {
    console.error('Rating submission failed:', error);
    throw new Error(error.message || 'Failed to submit rating');
  }
}

export async function getUserRatings(): Promise<RatedSong[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('You must be logged in to view ratings');
  }

  const { data, error } = await supabase
    .from('ratings')
    .select(`
      rating,
      created_at,
      songs (
        spotify_id,
        name,
        artist,
        album_id,
        albums (
          spotify_id,
          name,
          spotify_albums (
            album_art
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch ratings:', error);
    throw new Error('Failed to fetch ratings');
  }

  return data.map((row) => ({
    id: row.songs.spotify_id,
    name: row.songs.name,
    artist: row.songs.artist,
    albumId: row.songs.album_id,
    album: row.songs.albums.name,
    albumArt: row.songs.albums.spotify_albums?.album_art,
    rating: row.rating,
    rated_at: row.created_at,
  }));
}