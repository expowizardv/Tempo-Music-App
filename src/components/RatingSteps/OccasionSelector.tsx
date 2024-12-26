import { OCCASIONS, type Occasion } from '../../types/ratings';

interface OccasionSelectorProps {
  selectedOccasions: Occasion[];
  onChange: (occasions: Occasion[]) => void;
}

export function OccasionSelector({ selectedOccasions, onChange }: OccasionSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-center mb-4">When would you listen to this?</h3>
      <div className="grid grid-cols-2 gap-2">
        {(Object.entries(OCCASIONS) as [Occasion, string][]).map(([occasion, label]) => (
          <button
            key={occasion}
            onClick={() => {
              const isSelected = selectedOccasions.includes(occasion);
              onChange(
                isSelected
                  ? selectedOccasions.filter(o => o !== occasion)
                  : [...selectedOccasions, occasion]
              );
            }}
            className={`p-3 rounded-lg text-left transition-colors ${
              selectedOccasions.includes(occasion)
                ? 'bg-orange-500 hover:bg-orange-400'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}