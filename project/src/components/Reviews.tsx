import { useLang } from '../i18n/LanguageContext';

export interface Review {
  text: string;
  text_ru?: string;
  text_en?: string;
  author: string;
  item: string;
  item_ru?: string;
  item_en?: string;
}

interface Props {
  reviews: Review[];
}

const STARS = [1, 2, 3, 4, 5];

export default function Reviews({ reviews }: Props) {
  const { t, loc } = useLang();

  return (
    <div>
      <div className="mb-10">
        <p className="text-zinc-600 font-mono text-xs tracking-widest uppercase mb-3">{t('reviews.title')}</p>
        <div className="flex items-baseline gap-4">
          <h1 className="text-white font-black text-5xl md:text-6xl tracking-tight leading-none">
            {t('reviews.heading')}
          </h1>
          <span className="text-zinc-600 font-mono text-sm">{t('reviews.count', { count: reviews.length })}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-6 flex flex-col gap-4 hover:border-zinc-700 transition-colors"
          >
            <div className="flex gap-0.5">
              {STARS.map(s => (
                <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#fff" className="opacity-90">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>

            <p className="text-zinc-300 text-sm leading-relaxed flex-1">{loc(review, 'text')}</p>

            <div className="border-t border-zinc-800/60 pt-4 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">{review.author}</p>
                <p className="text-zinc-600 font-mono text-xs">{loc(review, 'item')}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                {review.author ? review.author.charAt(0) : '?'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
