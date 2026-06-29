import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import SEO, { productSchema } from '../components/SEO';

interface Product {
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

const modules = import.meta.glob('../data/products/*.json', { eager: true }) as Record<string, any>;
const allProducts: Product[] = Object.values(modules).map((mod: any) => {
  const data = mod.default ?? mod;
  return { ...data, id: data.id || Math.random().toString(36).slice(2) };
});

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, loc } = useLang();
  const product = allProducts.find(p => p.id === id);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 pt-32 pb-16 text-center">
        <SEO title="404" path={`/catalog/${id}`} />
        <p className="text-zinc-500 font-mono text-sm uppercase">{t('product.not_found')}</p>
        <button onClick={() => navigate('/catalog')} className="mt-6 border border-zinc-700 text-white text-xs font-mono uppercase px-6 py-3 hover:border-white transition-all">
          {t('product.back')}
        </button>
      </div>
    );
  }

  const name = loc(product, 'name');
  const brand = loc(product, 'brand');
  const price = product.price;
  const sizes = loc(product, 'sizes');
  const images: string[] = Array.isArray(product.images) ? product.images : [];
  const seller_tg = product.seller_tg;
  const condition = loc(product, 'condition');
  const sold = product.sold;
  const description = loc(product, 'description');
  const category = loc(product, 'category');

  const rawUsername = (seller_tg ?? '').toString().trim().replace(/^@/, '');
  const username = rawUsername || '5am_store_official';
  const telegramUrl = 'https://t.me/' + username;

  return (
    <>
      <SEO
        title={name}
        description={`${brand} ${name} — ${price} ${t('product.uah')}. ${description || ''}`.slice(0, 200)}
        path={`/catalog/${product.id}`}
        jsonLd={productSchema({ name, price, brand: brand || '5AM', category: category || '', images, sizes, description: description || undefined, condition, sold })}
      />
      <div className="max-w-screen-xl mx-auto px-6 pt-24 pb-16">

        <button onClick={() => navigate('/catalog')} className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-colors mb-10 flex items-center gap-2">
          {t('catalog.back')}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          <div className="flex flex-col gap-3">
            <div className="aspect-[4/5] bg-zinc-900 rounded-xl overflow-hidden">
            <img
              src={images[activeImg] ?? ''}
              alt={name}
              width="600" height="750"
              className="w-full h-full object-cover"
            />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((src: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ' + (activeImg === i ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80')}
                  >
                    <img src={src} alt="" width="64" height="64" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-2">{brand || '5AM'}</p>
            <h1 className="text-white font-black text-3xl uppercase leading-tight mb-2">{name}</h1>
            <p className="text-white font-bold text-2xl mb-8">{Number(price).toLocaleString('uk-UA')} <span className="text-zinc-500 text-sm font-normal">{t('product.uah')}</span></p>

            <div className="flex flex-col gap-4 mb-8">
              {condition && (
                <div className="flex items-center justify-between border border-zinc-800 px-4 py-3 rounded-lg">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">{t('product.condition')}</span>
                  <span className="text-white text-xs font-medium">{condition}</span>
                </div>
              )}
              {sizes && (
                <div className="flex items-center justify-between border border-zinc-800 px-4 py-3 rounded-lg">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">{t('product.size')}</span>
                  <span className="text-white text-xs font-medium">{sizes}</span>
                </div>
              )}
              {category && (
                <div className="flex items-center justify-between border border-zinc-800 px-4 py-3 rounded-lg">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">{t('product.category')}</span>
                  <span className="text-white text-xs font-medium">{category}</span>
                </div>
              )}
            </div>

            {description && (
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 border-t border-zinc-800 pt-6">{description}</p>
            )}

            {sold ? (
              <div className="border border-zinc-800 text-zinc-600 text-xs font-mono uppercase px-6 py-4 text-center rounded-lg">
                {t('product.sold')}
              </div>
            ) : (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black text-xs font-bold uppercase px-6 py-4 text-center rounded-lg hover:bg-zinc-200 transition-all tracking-widest"
              >
                {t('product.buy')}
              </a>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
