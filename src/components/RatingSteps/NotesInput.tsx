interface NotesInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function NotesInput({ value, onChange }: NotesInputProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-center mb-4">Any personal notes?</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What memories does this song bring up? How does it make you feel?"
        className="w-full h-32 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 resize-none"
      />
    </div>
  );
}