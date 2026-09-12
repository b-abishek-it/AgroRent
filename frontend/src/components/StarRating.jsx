import { useState } from "react";

const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          className={`text-2xl transition-colors focus:outline-none ${
            star <= (hover || rating) ? "text-yellow-400" : "text-slate-300"
          }`}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Rate ${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
