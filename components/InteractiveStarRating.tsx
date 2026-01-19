import React, { useState } from 'react';
import { StarIcon } from './Icons';

interface InteractiveStarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  totalStars?: number;
}

const InteractiveStarRating: React.FC<InteractiveStarRatingProps> = ({ rating, onRatingChange, totalStars = 5 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={index}
            className="focus:outline-none"
            onClick={() => onRatingChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            aria-label={`${starValue} yıldız ver`}
          >
            <StarIcon 
              className={`h-6 w-6 cursor-pointer transition-colors ${
                starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default InteractiveStarRating;
