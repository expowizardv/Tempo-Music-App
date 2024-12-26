import { useState } from 'react';

const EMOJIS = ['😢', '😕', '😐', '🙂', '🤩'];

interface RatingSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function RatingSlider({ value, onChange }: RatingSliderProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const displayValue = hoveredValue ?? value;

  return (
    <div className="space-y-4">
      <div className="flex justify-between px-2">
        {EMOJIS.map((emoji, index) => (
          <span
            key={index}
            className={`text-2xl transition-transform ${
              index + 1 === displayValue ? 'scale-125' : 'scale-100 opacity-50'
            }`}
          >
            {emoji}
          </span>
        ))}
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percentage = (e.clientX - rect.left) / rect.width;
          setHoveredValue(Math.ceil(percentage * 5));
        }}
        onMouseLeave={() => setHoveredValue(null)}
        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}