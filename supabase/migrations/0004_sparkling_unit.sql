/*
  # Fix rating submission flow

  1. Changes
    - Add profile creation to rating function
    - Make transaction atomic
    - Improve error handling

  2. Security
    - Maintain existing RLS policies
    - Keep security definer for atomic operations
*/

CREATE OR REPLACE FUNCTION upsert_song_and_rate(
  p_spotify_id text,
  p_name text,
  p_artist text,
  p_album_id text,
  p_album_name text,
  p_album_artist text,
  p_album_release_date date,
  p_rating integer
)
RETURNS void AS $$
DECLARE
  v_user_id uuid;
  v_user_email text;
BEGIN
  -- Get current user info
  SELECT auth.uid() INTO v_user_id;
  SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;

  -- Ensure profile exists
  INSERT INTO profiles (id, email)
  VALUES (v_user_id, v_user_email)
  ON CONFLICT (id) DO NOTHING;

  -- Insert album
  INSERT INTO albums (spotify_id, name, artist, release_date)
  VALUES (p_album_id, p_album_name, p_album_artist, p_album_release_date)
  ON CONFLICT (spotify_id) DO UPDATE
  SET name = EXCLUDED.name,
      artist = EXCLUDED.artist;

  -- Insert song
  INSERT INTO songs (spotify_id, name, artist, album_id)
  VALUES (p_spotify_id, p_name, p_artist, p_album_id)
  ON CONFLICT (spotify_id) DO UPDATE
  SET name = EXCLUDED.name,
      artist = EXCLUDED.artist;

  -- Insert rating
  INSERT INTO ratings (user_id, song_spotify_id, rating)
  VALUES (v_user_id, p_spotify_id, p_rating)
  ON CONFLICT (user_id, song_spotify_id)
  DO UPDATE SET 
    rating = EXCLUDED.rating,
    created_at = now();

EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Rating submission failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;