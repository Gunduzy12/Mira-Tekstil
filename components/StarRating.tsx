import React from 'react';
import { StarIcon } from './Icons';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon 
            key={index}
            className={`h-5 w-5 ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        );
      })}
    </div>
  );
};

export default StarRating;