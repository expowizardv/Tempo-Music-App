import { RATING_CATEGORIES, type RatingCategory } from '../../types/ratings';

export interface RatingStep {
  id: RatingCategory;
  title: string;
  description: string;
  emoji: string;
}

export const ratingSteps: RatingStep[] = [
  {
    id: 'melody',
    title: 'Melody',
    description: 'How catchy and memorable is the melody?',
    emoji: '🎵',
  },
  {
    id: 'lyrics',
    title: 'Lyrics',
    description: 'How meaningful and well-written are the lyrics?',
    emoji: '✍️',
  },
  {
    id: 'production',
    title: 'Production',
    description: 'How well-produced and polished is the song?',
    emoji: '🎚️',
  },
  {
    id: 'originality',
    title: 'Originality',
    description: 'How unique and innovative is the song?',
    emoji: '💫',
  },
];