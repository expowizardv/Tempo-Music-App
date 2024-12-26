/*
  # Enhanced Rating System

  1. New Tables
    - `rating_contexts`
      - `id` (uuid, primary key)
      - `rating_id` (uuid, references ratings)
      - `moods` (text array)
      - `occasions` (text array)
      - `notes` (text)

  2. Changes
    - Add context support to ratings

  3. Security
    - Enable RLS on new table
    - Add policies for authenticated users
*/

-- Create enum types for moods and occasions
CREATE TYPE rating_mood AS ENUM (
  'energetic', 'melancholic', 'peaceful', 'uplifting', 'intense', 'nostalgic'
);

CREATE TYPE rating_occasion AS ENUM (
  'workout', 'study', 'party', 'relaxation', 'commute', 'focus'
);

-- Create rating contexts table
CREATE TABLE rating_contexts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating_id uuid REFERENCES ratings(id) ON DELETE CASCADE,
  moods rating_mood[] DEFAULT '{}',
  occasions rating_occasion[] DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(rating_id)
);

-- Enable RLS
ALTER TABLE rating_contexts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own rating contexts"
  ON rating_contexts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ratings
      WHERE ratings.id = rating_contexts.rating_id
      AND ratings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own rating contexts"
  ON rating_contexts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ratings
      WHERE ratings.id = rating_contexts.rating_id
      AND ratings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own rating contexts"
  ON rating_contexts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ratings
      WHERE ratings.id = rating_contexts.rating_id
      AND ratings.user_id = auth.uid()
    )
  );

-- Update the rating function to include context
CREATE OR REPLACE FUNCTION upsert_song_and_rate(
  p_spotify_id text,
  p_name text,
  p_artist text,
  p_album_id text,
  p_album_name text,
  p_album_artist text,
  p_album_release_date date,
  p_rating integer,
  p_moods rating_mood[] DEFAULT NULL,
  p_occasions rating_occasion[] DEFAULT NULL,
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
      artist = EXCLUDED.artist;

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

  -- Insert or update context if provided
  IF p_moods IS NOT NULL OR p_occasions IS NOT NULL OR p_notes IS NOT NULL THEN
    INSERT INTO rating_contexts (rating_id, moods, occasions, notes)
    VALUES (v_rating_id, p_moods, p_occasions, p_notes)
    ON CONFLICT (rating_id)
    DO UPDATE SET
      moods = EXCLUDED.moods,
      occasions = EXCLUDED.occasions,
      notes = EXCLUDED.notes;
  END IF;

  RETURN v_rating_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;