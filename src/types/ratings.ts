export const RATING_CATEGORIES = {
  melody: 'Melody',
  lyrics: 'Lyrics',
  production: 'Production',
  originality: 'Originality',
} as const;

export type RatingCategory = keyof typeof RATING_CATEGORIES;

export interface Rating {
  category: RatingCategory;
  value: number;
}