export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Sign Up",
    description: "Create your account in seconds and connect with your Spotify account."
  },
  {
    title: "Search & Rate",
    description: "Search for any song or album from Spotify's library and rate it from 1 to 5 stars."
  },
  {
    title: "Track Progress",
    description: "Your ratings are automatically saved and organized. Album averages are calculated automatically."
  },
  {
    title: "Discover Insights",
    description: "View your rating history, discover your favorite artists, and see your music taste evolve over time."
  }
];