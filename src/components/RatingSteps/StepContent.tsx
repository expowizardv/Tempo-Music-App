import { RatingStep } from './types';
import { RatingSlider } from './RatingSlider';

interface StepContentProps {
  step: RatingStep;
  value: number;
  onChange: (value: number) => void;
}

export function StepContent({ step, value, onChange }: StepContentProps) {
  return (
    <div className="text-center">
      <span className="text-6xl mb-6 block">{step.emoji}</span>
      <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
      <p className="text-gray-400 mb-8">{step.description}</p>
      <RatingSlider value={value} onChange={onChange} />
    </div>
  );
}