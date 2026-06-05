export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 mt-24">
      <div className="max-w-screen-xl mx-auto px-6 py-16">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">

          <div>
            <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest mb-3">Premium resell</p>
            <h2 className="text-white font-black text-5xl uppercase leading-none">5AM<span className="text-zinc-600 font-light text-2xl ml-2">STORE</span></h2>
            <p className="text-zinc-500 text-sm mt-4 max-w-xs">Преміальний дропчік та аксесуари.<br />Оновлення каталогу щотижня.</p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest mb-1">Навігація</p>
            <a href="/catalog" className="text-zinc-400 hover:text-white text-sm transition-colors">Каталог</a>
            <a href="/reviews" className="text-zinc-400 hover:text-white text-sm transition-colors">Відгуки</a>
            <a href="/faq" className="text-zinc-400 hover:text-white text-sm transition-colors">FAQ</a>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest mb-1">Контакт</p>
            <a href="https://t.me/store_5am" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-zinc-700 text-white text-xs font-mono uppercase px-4 py-2 hover:border-white transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.01 9.473c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.26 14.4l-2.95-.924c-.64-.203-.654-.64.136-.948l11.532-4.448c.537-.194 1.006.131.584.168z"/></svg>
              TG
            </a>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-16 pt-8 border-t border-zinc-900">
          <p className="text-zinc-700 font-mono text-[10px] uppercase tracking-widest">© {year} 5AM Store. All rights reserved.</p>
          <a
            href="https://krvtsv.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-black font-bold text-xs uppercase tracking-widest transition-all hover:scale-105"
          >
            Сайт зроблений KRVTSV CORP
          </a>
          <p className="text-zinc-800 font-mono text-[10px] uppercase tracking-widest">Est. 2024 — Kyiv, Ukraine</p>
        </div>

      </div>
    </footer>
  );
}
