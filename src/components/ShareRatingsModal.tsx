import { X, Copy, Twitter } from 'lucide-react';
import { useState } from 'react';
import type { RatedSong } from '../types';

interface ShareRatingsModalProps {
  ratings: RatedSong[];
  onClose: () => void;
}

export function ShareRatingsModal({ ratings, onClose }: ShareRatingsModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `My Latest Music Ratings on Tempo:\n\n${ratings
    .slice(0, 5)
    .map((song) => `${song.name} by ${song.artist} - ${song.rating}/5⭐`)
    .join('\n')}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTweet = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(tweetUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Share Your Ratings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
            {shareText}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleTweet}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] rounded-lg transition-colors"
          >
            <Twitter className="h-4 w-4" />
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}