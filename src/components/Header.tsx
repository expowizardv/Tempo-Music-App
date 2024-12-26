import { Music2, LogOut, User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/auth';
import { AuthModal } from './AuthModal';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <header className="fixed w-full bg-white/50 dark:bg-black/50 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Music2 className="h-6 w-6 text-indigo-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Tempo</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  to="/account"
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title="Account"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white rounded-full transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span className="font-medium">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}