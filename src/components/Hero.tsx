import { Music2 } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/90" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative">
        <div className="max-w-2xl">
          <h1 className="text-5xl sm:text-7xl font-bold leading-tight mb-8">
            <span className="text-orange-500">Rate</span> and track<br />
            your music journey
          </h1>

          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Create your personal music collection. Rate songs, discover new favorites, 
            and keep track of what moves you.
          </p>

          <button
            onClick={onStart}
            className="bg-orange-500 hover:bg-orange-400 px-8 py-4 rounded-lg font-medium transition-colors text-lg"
          >
            Start Your Collection
          </button>

          <div className="grid grid-cols-3 gap-8 mt-24 border-t border-white/10 pt-8">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-2">
                <div className="text-lg font-medium text-orange-500">
                  {feature.title}
                </div>
                <div className="text-sm text-gray-400">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    title: "Personal Ratings",
    description: "Rate songs your way"
  },
  {
    title: "Build Collection",
    description: "Track your favorites"
  },
  {
    title: "Find Patterns",
    description: "See your taste evolve"
  }
];