import { supabase } from './supabase';

const CLIENT_ID = '32b3f89da8264b688c9aa541e57a3194';
const CLIENT_SECRET = '5494c70644424d3d89069cf100226def';

let accessToken: string | null = null;
let tokenExpirationTime: number | null = null;

async function getAccessToken(): Promise<string> {
  if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpirationTime = Date.now() + data.expires_in * 1000;
  return accessToken;
}

async function storeAlbumArtwork(albumId: string, artworkUrl: string) {
  await supabase.rpc('update_album_artwork', {
    p_spotify_id: albumId,
    p_album_art: artworkUrl
  });
}

export async function searchSpotify(query: string) {
  const token = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,album&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  
  const tracks = await Promise.all(data.tracks.items.map(async (track: any) => {
    if (track.album.images[0]?.url) {
      await storeAlbumArtwork(track.album.id, track.album.images[0].url);
    }
    return {
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      albumId: track.album.id,
      albumArt: track.album.images[0]?.url,
    };
  }));

  const albums = await Promise.all(data.albums.items.map(async (album: any) => {
    if (album.images[0]?.url) {
      await storeAlbumArtwork(album.id, album.images[0].url);
    }
    return {
      id: album.id,
      name: album.name,
      artist: album.artists[0].name,
      albumArt: album.images[0]?.url,
    };
  }));

  return { tracks, albums };
}

export async function getAlbum(albumId: string) {
  const token = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const album = await response.json();
  
  if (album.images[0]?.url) {
    await storeAlbumArtwork(album.id, album.images[0].url);
  }

  return {
    id: album.id,
    name: album.name,
    artist: album.artists[0].name,
    albumArt: album.images[0]?.url,
    tracks: album.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: album.name,
      albumId: album.id,
      albumArt: album.images[0]?.url,
    })),
  };
}