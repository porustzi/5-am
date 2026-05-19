// Файл: src/components/LanguageSwitcher.tsx
import { useLang } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-0.5 p-1 border border-zinc-900 rounded-full bg-black">
      {/* Кнопка УКР */}
      <button 
        onClick={() => setLang('ua')}
        className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-all ${
          lang === 'ua' ? 'bg-[#141414]' : ''
        }`}
      >
        <span className={`font-mono font-bold text-[11px] uppercase ${lang === 'ua' ? 'text-zinc-500' : 'text-zinc-700'}`}>UA</span>
        <span className={`font-mono font-bold text-[11px] uppercase ${lang === 'ua' ? 'text-white' : 'text-zinc-600'}`}>УКР</span>
        {lang === 'ua' && <span className="w-2 h-2 rounded-full bg-[#E51616] animate-pulse"></span>}
      </button>

      {/* Кнопка РУС */}
      <button 
        onClick={() => setLang('ru')}
        className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-all ${
          lang === 'ru' ? 'bg-[#141414]' : ''
        }`}
      >
        <span className={`font-mono font-bold text-[11px] uppercase ${lang === 'ru' ? 'text-zinc-500' : 'text-zinc-700'}`}>RU</span>
        <span className={`font-mono font-bold text-[11px] uppercase ${lang === 'ru' ? 'text-white' : 'text-zinc-600'}`}>РУС</span>
        {lang === 'ru' && <span className="w-2 h-2 rounded-full bg-[#E51616] animate-pulse"></span>}
      </button>
    </div>
  );
}
