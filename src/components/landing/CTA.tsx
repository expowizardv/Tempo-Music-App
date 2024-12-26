interface CTAProps {
  onStart: () => void;
}

export function LandingCTA({ onStart }: CTAProps) {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-orange-950/20" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to start your collection?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join Tempo today and begin documenting your musical journey. 
            Every rating tells your story.
          </p>
          <button
            onClick={onStart}
            className="bg-orange-500 hover:bg-orange-400 px-12 py-4 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 text-lg"
          >
            Create Your Collection
          </button>
        </div>
      </div>
    </section>
  );
}