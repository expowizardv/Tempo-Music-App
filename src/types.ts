export interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumId: string;
  albumArt?: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  tracks: Song[];
  albumArt?: string;
}

export interface RatedSong extends Song {
  rating: number;
  rated_at: string;
}