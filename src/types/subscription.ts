export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionFeatures {
  maxRatings: number;
  detailedAnalytics: boolean;
  customCategories: boolean;
  exportData: boolean;
}

export const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    maxRatings: 3,
    detailedAnalytics: false,
    customCategories: false,
    exportData: false,
  },
  premium: {
    maxRatings: Infinity,
    detailedAnalytics: true,
    customCategories: true,
    exportData: true,
  }
};