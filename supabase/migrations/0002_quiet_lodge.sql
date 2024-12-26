/*
  # Add Foreign Key Constraints

  1. Changes
    - Add foreign key constraint between songs and albums tables
    - Update existing queries to use the correct relationship

  2. Security
    - Maintain existing RLS policies
*/

-- Add foreign key constraint
ALTER TABLE songs
ADD CONSTRAINT fk_songs_albums
FOREIGN KEY (album_id) REFERENCES albums(spotify_id);