import { useState, useEffect } from 'react';
import Reviews from '../components/Reviews';

// Создаем интерфейс для отзыва, чтобы TypeScript не ругался
export interface ReviewItem {
  text: string;
  author: string;
  item: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/reviews.json')
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Помилка завантаження відгуків:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase animate-pulse">
          Завантаження відгуків...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 pt-24 pb-16">
      <Reviews items={reviews} />
    </div>
  );
}
