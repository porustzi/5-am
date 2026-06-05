import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  sizes: string;
  images: string[];
  seller_tg?: string;
  condition?: string;
  sold?: boolean;
  description?: string;
}

export default function ProductCard(product: Product) {
  const { name, brand, price, sizes, images, sold } = product;
  const navigate = useNavigate();
  const { t } = useLang();
  const cover = Array.isArray(images) ? images[0] : '';

  return (
    <article
      onClick={() => !sold && navigate(`/catalog/${product.id}`)}
      className={'group relative flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden transition-all cursor-pointer ' + (sold ? 'opacity-60 cursor-default' : 'hover:border-zinc-700')}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
        <img src={cover} alt={name} width="400" height="500" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-white font-mono text-[10px] uppercase border border-white/30 px-3 py-1 rounded-full">{t('product.sold')}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-zinc-500 font-mono text-[10px] uppercase mb-1">{brand || '5AM'}</p>
        <h3 className="text-white font-medium text-sm truncate mb-3">{name}</h3>
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <span className="text-white font-bold text-sm">{Number(price).toLocaleString('uk-UA')} <span className="text-zinc-500 text-[10px]">{t('product.uah')}</span></span>
          <span className="text-zinc-500 font-mono text-[10px]">{sizes}</span>
        </div>
      </div>
    </article>
  );
}
