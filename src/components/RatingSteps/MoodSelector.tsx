import { useState } from 'react';
import { MOODS, type Mood } from '../../types/ratings';

interface MoodSelectorProps {
  selectedMoods: Mood[];
  onChange: (moods: Mood[]) => void;
}

export function MoodSelector({ selectedMoods, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-center mb-4">How does this song make you feel?</h3>
      <div className="grid grid-cols-2 gap-2">
        {(Object.entries(MOODS) as [Mood, string][]).map(([mood, label]) => (
          <button
            key={mood}
            onClick={() => {
              const isSelected = selectedMoods.includes(mood);
              onChange(
                isSelected
                  ? selectedMoods.filter(m => m !== mood)
                  : [...selectedMoods, mood]
              );
            }}
            className={`p-3 rounded-lg text-left transition-colors ${
              selectedMoods.includes(mood)
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