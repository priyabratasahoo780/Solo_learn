import { useState, useEffect } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const ReviewsCarousel = () => {
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/reviews');
        setReviews(data.data);
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
    };
    fetchReviews();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden py-16">
      <div className="flex gap-10 animate-scroll whitespace-nowrap px-8 hover:[animation-play-state:paused]">
        {/* Double the list for seamless loop */}
        {[...reviews, ...reviews].map((review, i) => (
          <div 
            key={`${review._id}-${i}`}
            className="inline-block w-80 sm:w-96 p-8 bg-white sketch-card border-oxford-blue shadow-[6px_6px_0px_0px_#cbd5e1] hover:shadow-[8px_8px_0px_0px_#FF5722] transition-all whitespace-normal flex-shrink-0 mx-4 cursor-default transform hover:-rotate-1"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-oxford-blue border-[2px] border-oxford-blue shadow-[3px_3px_0px_0px_#FF5722] flex items-center justify-center text-white font-black text-lg title-fredoka">
                {review.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-oxford-blue text-sm uppercase italic tracking-tight title-fredoka">{review.user.name}</h4>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-orange-400 text-orange-400' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="ml-auto opacity-10">
                <MessageSquareQuote className="w-8 h-8 text-oxford-blue" />
              </div>
            </div>
            <p className="text-slate-500 font-bold text-sm italic leading-relaxed border-l-[3px] border-dashed border-slate-100 pl-4">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ReviewsCarousel;
