import { supabase } from './supabase';
import { SUBSCRIPTION_FEATURES, type SubscriptionTier } from '../types/subscription';

export async function getUserSubscription(): Promise<SubscriptionTier> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  return (data?.subscription_tier as SubscriptionTier) || 'free';
}

export async function getRatingsCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from('ratings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return count || 0;
}

export async function canAddRating(userId: string): Promise<boolean> {
  const tier = await getUserSubscription();
  const { maxRatings } = SUBSCRIPTION_FEATURES[tier];
  
  if (maxRatings === Infinity) return true;
  
  const count = await getRatingsCount(userId);
  return count < maxRatings;
}