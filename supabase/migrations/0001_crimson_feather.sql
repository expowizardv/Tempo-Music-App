/*
  # Spotify Ratings Database Schema

  1. New Tables
    - `profiles`: Extended user profile information
      - `id` (uuid, matches auth.users id)
      - `email` (text)
      - `name` (text)
      - `created_at` (timestamp)
      
    - `songs`: Spotify songs that users have rated
      - `spotify_id` (text, Spotify's track ID)
      - `name` (text)
      - `artist` (text)
      - `album_id` (text, references Spotify album ID)
      - `created_at` (timestamp)
      
    - `albums`: Spotify albums related to rated songs
      - `spotify_id` (text, Spotify's album ID)
      - `name` (text)
      - `artist` (text)
      - `release_date` (date)
      - `created_at` (timestamp)
      
    - `ratings`: User ratings for songs
      - `id` (uuid)
      - `user_id` (uuid, references profiles)
      - `song_spotify_id` (text, references songs)
      - `rating` (integer, 1-5)
      - `created_at` (timestamp)
      
    - `average_ratings`: Calculated average ratings per user
      - `id` (uuid)
      - `user_id` (uuid, references profiles)
      - `song_spotify_id` (text, nullable, references songs)
      - `album_spotify_id` (text, nullable, references albums)
      - `average_rating` (numeric)
      - `total_ratings` (integer)
      - `last_updated` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Policies ensure users can only:
      - Read their own profile data
      - Read/write their own ratings
      - Read songs and albums they've rated
      - Read their own average ratings
      
  3. Functions
    - Update average ratings trigger function
    - Calculate album average ratings function
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Create songs table
CREATE TABLE songs (
  spotify_id text PRIMARY KEY,
  name text NOT NULL,
  artist text NOT NULL,
  album_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create albums table
CREATE TABLE albums (
  spotify_id text PRIMARY KEY,
  name text NOT NULL,
  artist text NOT NULL,
  release_date date,
  created_at timestamptz DEFAULT now()
);

-- Create ratings table
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  song_spotify_id text REFERENCES songs(spotify_id) NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, song_spotify_id)
);

-- Create average ratings table
CREATE TABLE average_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  song_spotify_id text REFERENCES songs(spotify_id),
  album_spotify_id text REFERENCES albums(spotify_id),
  average_rating numeric(3,2) NOT NULL,
  total_ratings integer NOT NULL DEFAULT 1,
  last_updated timestamptz DEFAULT now(),
  CHECK (
    (song_spotify_id IS NOT NULL AND album_spotify_id IS NULL) OR
    (song_spotify_id IS NULL AND album_spotify_id IS NOT NULL)
  ),
  UNIQUE(user_id, song_spotify_id),
  UNIQUE(user_id, album_spotify_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE average_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Songs policies
CREATE POLICY "Users can read songs they've rated"
  ON songs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ratings 
      WHERE ratings.song_spotify_id = songs.spotify_id 
      AND ratings.user_id = auth.uid()
    )
  );

-- Albums policies
CREATE POLICY "Users can read albums of songs they've rated"
  ON albums FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM songs 
      JOIN ratings ON ratings.song_spotify_id = songs.spotify_id
      WHERE songs.album_id = albums.spotify_id 
      AND ratings.user_id = auth.uid()
    )
  );

-- Ratings policies
CREATE POLICY "Users can read own ratings"
  ON ratings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own ratings"
  ON ratings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own ratings"
  ON ratings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Average ratings policies
CREATE POLICY "Users can read own average ratings"
  ON average_ratings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Function to update song average ratings
CREATE OR REPLACE FUNCTION update_song_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO average_ratings (
    user_id,
    song_spotify_id,
    average_rating,
    total_ratings
  )
  SELECT
    NEW.user_id,
    NEW.song_spotify_id,
    AVG(rating)::numeric(3,2),
    COUNT(*)
  FROM ratings
  WHERE user_id = NEW.user_id
  AND song_spotify_id = NEW.song_spotify_id
  GROUP BY user_id, song_spotify_id
  ON CONFLICT (user_id, song_spotify_id)
  DO UPDATE SET
    average_rating = EXCLUDED.average_rating,
    total_ratings = EXCLUDED.total_ratings,
    last_updated = now();

  -- Update album average rating
  INSERT INTO average_ratings (
    user_id,
    album_spotify_id,
    average_rating,
    total_ratings
  )
  SELECT
    NEW.user_id,
    s.album_id,
    AVG(r.rating)::numeric(3,2),
    COUNT(DISTINCT r.song_spotify_id)
  FROM ratings r
  JOIN songs s ON s.spotify_id = r.song_spotify_id
  WHERE r.user_id = NEW.user_id
  AND s.album_id = (SELECT album_id FROM songs WHERE spotify_id = NEW.song_spotify_id)
  GROUP BY NEW.user_id, s.album_id
  ON CONFLICT (user_id, album_spotify_id)
  DO UPDATE SET
    average_rating = EXCLUDED.average_rating,
    total_ratings = EXCLUDED.total_ratings,
    last_updated = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating average ratings
CREATE TRIGGER update_average_ratings
AFTER INSERT OR UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_song_average_rating();

-- Function to insert song if it doesn't exist
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
  -- Insert album if it doesn't exist
  INSERT INTO albums (spotify_id, name, artist, release_date)
  VALUES (p_album_id, p_album_name, p_album_artist, p_album_release_date)
  ON CONFLICT (spotify_id) DO NOTHING;

  -- Insert song if it doesn't exist
  INSERT INTO songs (spotify_id, name, artist, album_id)
  VALUES (p_spotify_id, p_name, p_artist, p_album_id)
  ON CONFLICT (spotify_id) DO NOTHING;

  -- Insert or update rating
  INSERT INTO ratings (user_id, song_spotify_id, rating)
  VALUES (auth.uid(), p_spotify_id, p_rating)
  ON CONFLICT (user_id, song_spotify_id)
  DO UPDATE SET rating = EXCLUDED.rating;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;