import { useState, useEffect } from 'react';
import { getUserRatings } from '../lib/ratings';
import { getUserSubscription } from '../lib/subscription';
import { BasicAccount } from '../components/account/BasicAccount';
import { PremiumAccount } from '../components/account/PremiumAccount';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { RatedSong } from '../types';
import type { SubscriptionTier } from '../types/subscription';

export function Account() {
  const [ratings, setRatings] = useState<RatedSong[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [ratingData, tier] = await Promise.all([
          getUserRatings(),
          getUserSubscription()
        ]);
        setRatings(ratingData);
        setSubscriptionTier(tier);
      } catch (err) {
        setError('Failed to load account data');
        console.error('Failed to load account data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] transition-colors">
      <div className="container mx-auto px-6 py-24">
        {subscriptionTier === 'premium' ? (
          <PremiumAccount ratings={ratings} />
        ) : (
          <BasicAccount ratings={ratings} />
        )}
      </div>
    </div>
  );
}