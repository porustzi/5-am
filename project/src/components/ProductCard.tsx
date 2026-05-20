export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  sizes: string;
  imageUrl: string;
  seller_tg?: string;
  condition?: string;
  sold?: boolean;
}

export default function ProductCard(product: Product) {
  const { name, brand, price, sizes, imageUrl, seller_tg, sold } = product;
  const rawUsername = (seller_tg ?? '').toString().trim().replace(/^@/, '');
  const username = rawUsername || '5am_store_official';
  const telegramUrl = 'https://t.me/' + username;

  return (
    <div className={'group relative flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden transition-all ' + (sold ? 'opacity-60' : 'hover:border-zinc-700')}>
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {!sold && (
          <div className="absolute top-3 right-3 z-10">
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-white transition-all shadow-lg" onClick={(e) => e.stopPropagation()}>Написати</a>
          </div>
        )}
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-white font-mono text-[10px] uppercase border border-white/30 px-3 py-1 rounded-full">Продано</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-zinc-500 font-mono text-[10px] uppercase mb-1">{brand || '5AM'}</p>
        <h3 className="text-white font-medium text-sm truncate mb-3">{name}</h3>
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <span className="text-white font-bold text-sm">{Number(price).toLocaleString('uk-UA')} <span className="text-zinc-500 text-[10px]">грн</span></span>
          <span className="text-zinc-500 font-mono text-[10px]">{sizes}</span>
        </div>
      </div>
    </div>
  );
}
