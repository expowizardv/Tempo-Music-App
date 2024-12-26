import { createClient } from '@supabase/supabase-js';
import type { Song } from '../types';
import type { RATING_CATEGORIES } from '../components/RatingSteps/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function submitRating(
  song: Song,
  ratings: Record<keyof typeof RATING_CATEGORIES, number>
) {
  const { error } = await supabase.rpc('upsert_song_and_rate', {
    p_spotify_id: song.id,
    p_name: song.name,
    p_artist: song.artist,
    p_album_id: song.albumId,
    p_album_name: song.album,
    p_album_artist: song.artist,
    p_album_release_date: null, // We don't have this info from the Spotify API yet
    p_rating: Math.round(
      Object.values(ratings).reduce((sum, val) => sum + val, 0) / 
      Object.values(ratings).length
    ),
  });

  if (error) {
    throw error;
  }
}