import { useEffect, useState } from 'react';

const LANGS = ['uk', 'ru', 'en'];

function setGoogleLang(lang: string) {
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  } else if (lang !== 'uk') {
    const check = setInterval(() => {
      const el = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (el) {
        el.value = lang;
        el.dispatchEvent(new Event('change'));
        clearInterval(check);
      }
    }, 200);
    setTimeout(() => clearInterval(check), 5000);
  }
}

export default function LangSwitch() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if ((window as any).googleTranslateElementInit) return;
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'uk',
        includedLanguages: 'uk,ru,en',
        autoDisplay: false,
      }, 'google_translate_element');
    };
    const s = document.createElement('script');
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const handleClick = () => {
    const next = (current + 1) % LANGS.length;
    setCurrent(next);
    const lang = LANGS[next];
    if (lang === 'uk') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      location.reload();
    } else {
      setGoogleLang(lang);
    }
  };

  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <button
        onClick={handleClick}
        className="px-2.5 py-1 text-xs font-mono font-bold text-zinc-500 border border-zinc-800 rounded-md hover:border-zinc-600 hover:text-zinc-300 transition-all tracking-wider uppercase"
        aria-label="Switch language"
      >
        {LANGS[current]}
      </button>
    </>
  );
}
