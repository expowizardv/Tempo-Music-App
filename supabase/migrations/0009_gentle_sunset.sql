/*
  # Fix Rating Function Parameters

  1. Changes
    - Make album release date parameter optional
    - Add proper default values for arrays
*/

CREATE OR REPLACE FUNCTION upsert_song_and_rate(
  p_spotify_id text,
  p_name text,
  p_artist text,
  p_album_id text,
  p_album_name text,
  p_album_artist text,
  p_album_release_date date,
  p_rating integer,
  p_moods rating_mood[] DEFAULT ARRAY[]::rating_mood[],
  p_occasions rating_occasion[] DEFAULT ARRAY[]::rating_occasion[],
  p_notes text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_user_id uuid;
  v_rating_id uuid;
BEGIN
  -- Get current user
  SELECT auth.uid() INTO v_user_id;

  -- Insert album
  INSERT INTO albums (spotify_id, name, artist, release_date)
  VALUES (p_album_id, p_album_name, p_album_artist, p_album_release_date)
  ON CONFLICT (spotify_id) DO UPDATE
  SET name = EXCLUDED.name,
      artist = EXCLUDED.artist,
      release_date = COALESCE(EXCLUDED.release_date, albums.release_date);

  -- Insert song
  INSERT INTO songs (spotify_id, name, artist, album_id)
  VALUES (p_spotify_id, p_name, p_artist, p_album_id)
  ON CONFLICT (spotify_id) DO UPDATE
  SET name = EXCLUDED.name,
      artist = EXCLUDED.artist;

  -- Insert or update rating
  INSERT INTO ratings (user_id, song_spotify_id, rating)
  VALUES (v_user_id, p_spotify_id, p_rating)
  ON CONFLICT (user_id, song_spotify_id)
  DO UPDATE SET 
    rating = EXCLUDED.rating,
    created_at = now()
  RETURNING id INTO v_rating_id;

  -- Insert or update context
  INSERT INTO rating_contexts (rating_id, moods, occasions, notes)
  VALUES (v_rating_id, p_moods, p_occasions, p_notes)
  ON CONFLICT (rating_id)
  DO UPDATE SET
    moods = EXCLUDED.moods,
    occasions = EXCLUDED.occasions,
    notes = EXCLUDED.notes;

  RETURN v_rating_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;