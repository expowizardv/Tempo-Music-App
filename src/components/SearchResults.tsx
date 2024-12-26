import { Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Song, type Album } from '../types';

interface SearchResultsProps {
  tracks: Song[];
  albums: Album[];
}

export function SearchResults({ tracks, albums }: SearchResultsProps) {
  if (tracks.length === 0 && albums.length === 0) {
    return (
      <div className="text-center text-gray-400">
        Search for songs or albums to start rating them
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {albums.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Albums</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map((album) => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                {album.albumArt ? (
                  <img
                    src={album.albumArt}
                    alt={album.name}
                    className="w-full aspect-square object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full aspect-square bg-white/10 rounded-lg flex items-center justify-center mb-4">
                    <Music className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <h3 className="font-medium">{album.name}</h3>
                <p className="text-sm text-gray-400">{album.artist}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {tracks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Songs</h2>
          <div className="grid gap-4">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {track.albumArt ? (
                    <img
                      src={track.albumArt}
                      alt={track.album}
                      className="w-12 h-12 rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center">
                      <Music className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{track.name}</h3>
                    <p className="text-sm text-gray-400">
                      {track.artist} • {track.album}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/album/${track.albumId}`}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-full text-sm font-medium transition-colors"
                >
                  Rate
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}