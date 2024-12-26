import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHero } from '../components/landing/Hero';
import { LandingFeatures } from '../components/landing/Features';
import { Pricing } from '../components/landing/Pricing';
import { LandingCTA } from '../components/landing/CTA';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const handleStart = () => {
    if (user) {
      navigate('/search');
    } else {
      setShowAuth(true);
    }
  };

  return (
    <>
      <LandingHero onStart={handleStart} />
      <LandingFeatures />
      <Pricing onStart={handleStart} />
      <LandingCTA onStart={handleStart} />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultToSignUp={true} />}
    </>
  );
}