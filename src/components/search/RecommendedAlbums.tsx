import { Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Album } from '../../types';

const RECOMMENDED_ALBUMS: Album[] = [
  {
    id: '0S0KGZnfBGSIssfF54WSJh',
    name: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
    artist: 'Billie Eilish',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce',
    tracks: []
  },
  {
    id: '7GhytR6ZMWetf1jxAeX5Lu',
    name: 'UTOPIA',
    artist: 'Travis Scott',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273881d8d8378cd01099babcd44',
    tracks: []
  },
  {
    id: '3euz4vS7ezKGnNSwgyvKcd',
    name: 'Positions',
    artist: 'Ariana Grande',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b2735ef878a782c987d38d82b605',
    tracks: []
  }
];

export function RecommendedAlbums() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-6">Recommended Albums</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RECOMMENDED_ALBUMS.map((album) => (
          <Link
            key={album.id}
            to={`/album/${album.id}`}
            className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors group"
          >
            {album.albumArt ? (
              <img
                src={album.albumArt}
                alt={album.name}
                className="w-full aspect-square object-cover rounded-lg mb-4 group-hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-full aspect-square bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <Music className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <h3 className="font-medium mb-1">{album.name}</h3>
            <p className="text-sm text-gray-400">{album.artist}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}