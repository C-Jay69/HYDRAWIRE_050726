import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorTitle: string;
  rating?: number;
}

export function TestimonialCard({
  quote,
  authorName,
  authorTitle,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-[#f97316] text-[#f97316]"
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-gray-700 mb-6 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a56db] to-[#f97316] flex items-center justify-center text-white font-semibold text-sm">
          {authorName
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{authorName}</p>
          <p className="text-sm text-gray-500">{authorTitle}</p>
        </div>
      </div>
    </div>
  );
}
