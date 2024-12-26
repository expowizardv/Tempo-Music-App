import { Star, Heart, Compass, Library } from 'lucide-react';

export function LandingFeatures() {
  return (
    <section id="features" className="py-32 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-center">
            Your music, your ratings, your way
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 transition-colors group"
              >
                <feature.icon className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
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
    icon: Star,
    title: "Personal Ratings",
    description: "Rate songs based on melody, lyrics, production, and originality. Build your unique taste profile."
  },
  {
    icon: Heart,
    title: "Collection Building",
    description: "Create your personal music library. Keep track of your favorites and discover patterns in your taste."
  },
  {
    icon: Compass,
    title: "Music Discovery",
    description: "Find new music through your ratings. Let your taste guide you to your next favorite song."
  },
  {
    icon: Library,
    title: "Musical Memory",
    description: "Build a timeline of your musical journey. Remember when and why you loved each song."
  }
];