export interface RatingStep {
  id: keyof typeof RATING_CATEGORIES;
  title: string;
  description: string;
  emoji: string;
}

export const RATING_CATEGORIES = {
  melody: 'Melody',
  lyrics: 'Lyrics',
  production: 'Production',
  originality: 'Originality',
} as const;