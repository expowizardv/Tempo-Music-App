/*
  # Fix rating constraints and relationships

  1. Changes
    - Add missing foreign key relationships
    - Update upsert_song_and_rate function to handle ratings properly
    - Add proper error handling
*/

-- Ensure foreign key relationships are properly set up
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'fk_songs_albums'
  ) THEN
    ALTER TABLE songs
    ADD CONSTRAINT fk_songs_albums
    FOREIGN KEY (album_id) REFERENCES albums(spotify_id);
  END IF;
END $$;

-- Update the upsert function with better error handling
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
BEGIN
  -- Validate rating
  IF p_rating IS NULL OR p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  -- Insert album if it doesn't exist
  INSERT INTO albums (spotify_id, name, artist, release_date)
  VALUES (p_album_id, p_album_name, p_album_artist, p_album_release_date)
  ON CONFLICT (spotify_id) DO UPDATE
  SET name = EXCLUDED.name,
      artist = EXCLUDED.artist;

  -- Insert song if it doesn't exist
  INSERT INTO songs (spotify_id, name, artist, album_id)
  VALUES (p_spotify_id, p_name, p_artist, p_album_id)
  ON CONFLICT (spotify_id) DO UPDATE
  SET name = EXCLUDED.name,
      artist = EXCLUDED.artist;

  -- Insert or update rating
  INSERT INTO ratings (user_id, song_spotify_id, rating)
  VALUES (auth.uid(), p_spotify_id, p_rating)
  ON CONFLICT (user_id, song_spotify_id)
  DO UPDATE SET 
    rating = EXCLUDED.rating,
    created_at = now();

EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Failed to save rating: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;