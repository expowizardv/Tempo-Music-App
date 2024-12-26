import { Music } from 'lucide-react';

export function AlbumSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[70vh] md:h-[50vh] bg-white/5 flex flex-col items-center justify-center">
        <div className="w-48 h-48 md:w-56 md:h-56 bg-white/10 rounded-lg mb-6" />
        <div className="h-8 w-64 bg-white/10 rounded mb-2" />
        <div className="h-6 w-48 bg-white/10 rounded" />
      </div>
      <div className="container mx-auto px-4 space-y-2 mt-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="w-6 text-gray-400">{i + 1}</div>
            <div className="flex-1">
              <div className="h-5 w-48 bg-white/10 rounded mb-2" />
              <div className="h-4 w-32 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div>
        <div className="h-7 w-32 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4">
              <div className="w-full aspect-square bg-white/10 rounded-lg mb-4" />
              <div className="h-5 w-3/4 bg-white/10 rounded mb-2" />
              <div className="h-4 w-1/2 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}