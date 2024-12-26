import { useState } from 'react';
import { X } from 'lucide-react';
import { ratingSteps } from './steps';
import { StepContent } from './StepContent';
import { ConfirmationPopup } from '../ConfirmationPopup';
import type { RatingCategory } from '../../types/ratings';
import type { Song } from '../../types';

interface StepModalProps {
  song: Song;
  onClose: () => void;
  onRate: (ratings: Record<RatingCategory, number>) => Promise<void>;
}

export function StepModal({ song, onClose, onRate }: StepModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ratings, setRatings] = useState<Record<RatingCategory, number>>({
    melody: 3,
    lyrics: 3,
    production: 3,
    originality: 3
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const step = ratingSteps[currentStep];
  const isLastStep = currentStep === ratingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setShowConfirmation(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onRate(ratings);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4">
        <div className="bg-[#1A1A1A] rounded-t-xl md:rounded-xl p-6 w-full md:max-w-md md:mx-4 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{song.name}</h3>
              <p className="text-sm text-gray-400 truncate">{song.artist}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-8">
            <StepContent
              step={step}
              value={ratings[step.id]}
              onChange={(value) =>
                setRatings((prev) => ({ ...prev, [step.id]: value }))
              }
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-full font-medium border border-white/20 hover:bg-white/10 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:hover:bg-orange-500 py-3 rounded-full font-medium transition-colors"
            >
              {isSubmitting
                ? 'Submitting...'
                : isLastStep
                ? 'Submit'
                : 'Next'}
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {ratingSteps.map((s, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentStep
                    ? 'bg-orange-500'
                    : i < currentStep
                    ? 'bg-white/50'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <ConfirmationPopup
        isOpen={showConfirmation}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmation(false)}
        title="Submit Rating"
        message={`Are you sure you want to submit your rating for "${song.name}"?`}
        confirmText={isSubmitting ? 'Submitting...' : 'Submit Rating'}
        cancelText="Review Again"
      />
    </>
  );
}