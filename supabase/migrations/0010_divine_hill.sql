/*
  # Add Spotify Albums Table
  
  1. New Tables
    - `spotify_albums`: Stores Spotify album metadata including artwork URLs
      - `spotify_id` (text, primary key): References albums.spotify_id
      - `album_art` (text): URL to album artwork
      - `created_at` (timestamptz): Timestamp of creation
  
  2. Changes
    - Add foreign key constraint to ensure data integrity
    - Enable RLS and add appropriate policies
*/

-- Create spotify_albums table
CREATE TABLE spotify_albums (
  spotify_id text PRIMARY KEY REFERENCES albums(spotify_id),
  album_art text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE spotify_albums ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read spotify album data"
  ON spotify_albums FOR SELECT
  TO authenticated
  USING (true);

-- Function to update album artwork
CREATE OR REPLACE FUNCTION update_album_artwork(
  p_spotify_id text,
  p_album_art text
)
RETURNS void AS $$
BEGIN
  INSERT INTO spotify_albums (spotify_id, album_art)
  VALUES (p_spotify_id, p_album_art)
  ON CONFLICT (spotify_id)
  DO UPDATE SET album_art = EXCLUDED.album_art;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;