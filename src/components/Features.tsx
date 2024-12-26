import { Star, Music, Album, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: "Rate Songs",
    description: "Rate any song from Spotify's vast library"
  },
  {
    icon: Album,
    title: "Track Albums",
    description: "See your album ratings automatically calculated"
  }
];

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {features.map((feature) => (
            <div key={feature.title} 
                 className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-colors">
              <feature.icon className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}