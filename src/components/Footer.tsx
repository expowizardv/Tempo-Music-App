import { Music2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music2 className="h-5 w-5 text-orange-400" />
            <span className="text-sm">Tempo</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Tempo
          </p>
        </div>
      </div>
    </footer>
  );
}