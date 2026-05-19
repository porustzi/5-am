import { Link } from 'react-router-dom';
import homeData from '../data/home.json';

export default function HomePage() {
  const content = (homeData as any)?.home_page ?? homeData ?? {};

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6 selection:bg-white selection:text-black">
      <div className="max-w-3xl">
        <p className="text-zinc-600 font-mono text-xs tracking-[0.3em] uppercase mb-4">
          WELCOME TO 5AM
        </p>
        <h1 className="text-white font-black text-5xl md:text-8xl tracking-tighter uppercase leading-none mb-6">
          {content.heroTitle || '5AM STORE'}
        </h1>
        <p className="text-zinc-400 text-sm md:text-base font-medium max-w-md mx-auto mb-10 leading-relaxed">
          {content.heroSubtitle || 'Преміальний дроп та аксесуари. Оновлення каталогу щотижня.'}
        </p>
        <Link
          to="/catalog"
          className="inline-block bg-white text-black text-xs md:text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-zinc-200 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {content.ctaText || 'Перейти до каталогу'}
        </Link>
      </div>
    </div>
  );
}
