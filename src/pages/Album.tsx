import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Music, ArrowLeft } from 'lucide-react';
import { getAlbum } from '../lib/spotify';
import { submitRating } from '../lib/ratings';
import { canAddRating } from '../lib/subscription';
import { StepModal } from '../components/RatingSteps/StepModal';
import { FreemiumLimitModal } from '../components/FreemiumLimitModal';
import { AlbumSkeleton } from '../components/LoadingSkeletons';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import type { Album, Song } from '../types';

export function Album() {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [showFreemiumLimit, setShowFreemiumLimit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadAlbum() {
      if (!id) return;
      try {
        const data = await getAlbum(id);
        setAlbum(data);
      } catch (error) {
        console.error('Failed to load album:', error);
        setError('Failed to load album');
        showToast('Failed to load album', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadAlbum();
  }, [id, showToast]);

  const handleSongSelect = async (song: Song) => {
    if (!user) return;
    
    try {
      const canRate = await canAddRating(user.id);
      if (!canRate) {
        setShowFreemiumLimit(true);
        return;
      }
      setSelectedSong(song);
    } catch (error) {
      console.error('Failed to check rating limit:', error);
      showToast('Failed to check rating limit', 'error');
    }
  };

  const handleRate = async (ratings: Record<string, number>) => {
    if (!selectedSong || !user) return;
    setError(null);
    
    try {
      await submitRating(selectedSong, ratings);
      setSelectedSong(null);
      showToast('Rating submitted successfully!');
    } catch (error) {
      console.error('Failed to submit rating:', error);
      const message = error instanceof Error ? error.message : 'Failed to submit rating';
      setError(message);
      showToast(message, 'error');
    }
  };

  if (isLoading) {
    return <AlbumSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        <Link to="/search" className="text-indigo-500 hover:underline mt-4 inline-block">
          Back to Search
        </Link>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Album not found</p>
        <Link to="/search" className="text-indigo-500 hover:underline mt-4 inline-block">
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="pb-8">
        <div className="relative h-[70vh] md:h-[50vh] bg-gradient-to-b from-black to-transparent">
          <Link
            to="/search"
            className="absolute top-4 left-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {album.albumArt ? (
              <img
                src={album.albumArt}
                alt={album.name}
                className="w-48 h-48 md:w-56 md:h-56 rounded-lg shadow-2xl mb-6"
              />
            ) : (
              <div className="w-48 h-48 md:w-56 md:h-56 bg-white/10 rounded-lg shadow-2xl mb-6 flex items-center justify-center">
                <Music className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{album.name}</h1>
            <p className="text-lg md:text-xl text-gray-400">{album.artist}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 space-y-2">
          {album.tracks.map((track, index) => (
            <button
              key={track.id}
              onClick={() => handleSongSelect(track)}
              className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
            >
              <span className="text-gray-400 w-6 text-right">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{track.name}</h3>
                <p className="text-sm text-gray-400 truncate">{track.artist}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedSong && (
        <StepModal
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
          onRate={handleRate}
        />
      )}

      {showFreemiumLimit && (
        <FreemiumLimitModal onClose={() => setShowFreemiumLimit(false)} />
      )}
    </>
  );
}