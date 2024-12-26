import { useEffect, useState } from 'react';
import { RatingPreview } from './RatingPreview';
import { sampleSongs } from '../../data/sampleSongs';

interface HeroProps {
  onStart: () => void;
}

export function LandingHero({ onStart }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sampleSongs.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen relative flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-30"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070")'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-black via-white/80 dark:via-black/80 to-transparent" />

      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-4xl mx-auto mb-24 pt-20">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Your Music Journey, Rated Your Way
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8">
            Build your personal music collection and discover how your taste evolves over time.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white rounded-xl font-medium transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20"
            >
              Start Rating
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="font-medium text-gray-900 dark:text-white">100% Free</div>
              No credit card required
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <RatingPreview song={sampleSongs[activeIndex]} />
        </div>
      </div>
    </section>
  );
}