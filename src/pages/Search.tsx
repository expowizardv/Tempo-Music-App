import { useState } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { SearchResults } from '../components/SearchResults';
import { SearchSkeleton } from '../components/LoadingSkeletons';
import { RecommendedAlbums } from '../components/search/RecommendedAlbums';
import { useToast } from '../contexts/ToastContext';
import { searchSpotify } from '../lib/spotify';
import type { Song, Album } from '../types';

export function Search() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ tracks: Song[], albums: Album[] }>({ tracks: [], albums: [] });
  const { showToast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const data = await searchSpotify(query);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      showToast('Failed to search. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a song or album..."
            className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3 pl-12 text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500 animate-spin" />
          )}
        </div>
      </form>

      {!query && !results.tracks.length && !results.albums.length && (
        <RecommendedAlbums />
      )}

      {isLoading ? (
        <SearchSkeleton />
      ) : (
        <SearchResults tracks={results.tracks} albums={results.albums} />
      )}
    </div>
  );
}