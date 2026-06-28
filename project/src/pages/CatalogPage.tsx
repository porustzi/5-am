import { useState, useMemo } from 'react';
import ProductCatalog from '../components/ProductCatalog';
import { type Product } from '../components/ProductCard';
import { useLang } from '../i18n/LanguageContext';
import SEO, { itemListSchema, breadcrumbSchema } from '../components/SEO';

const ALL_CAT = '__all__';

const modules = import.meta.glob('../data/products/*.json', { eager: true }) as Record<string, any>;

const loadedProducts: Product[] = Object.values(modules).map((mod: any) => {
  const data = mod.default ?? mod;
  return {
    ...data,
    id: data.id || Math.random().toString(36).slice(2),
    category: data.category ?? 'Інше',
  };
});

export default function CatalogPage() {
  const { t, loc } = useLang();
  const [products] = useState<Product[]>(loadedProducts);
  const [activeCat, setActiveCat] = useState(ALL_CAT);

  const categories = useMemo(() => {
    const catsFromData = Array.from(new Set(products.map(p => p.category)));
    return [ALL_CAT, ...catsFromData.sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return activeCat === ALL_CAT ? products : products.filter(p => p.category === activeCat);
  }, [activeCat, products]);

  const displayCategory = (cat: string) => {
    if (cat === ALL_CAT) return t('catalog.all');
    const product = products.find(p => p.category === cat);
    if (!product) return cat;
    return loc(product, 'category') || cat;
  };

  return (
    <>
      <SEO
        title={t('catalog.title')}
        description={t('home.subtitle')}
        path="/catalog"
        jsonLd={itemListSchema(filteredProducts.map(p => ({
          name: loc(p, 'name'),
          url: `/catalog/${p.id}`,
        })))}
      />
      <div className="max-w-screen-xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-12">
          <h1 className="text-white font-black text-5xl uppercase mb-8">{t('catalog.title')}</h1>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 border text-xs uppercase transition-all ${
                  activeCat === cat ? 'bg-white text-black' : 'border-zinc-900 text-zinc-500 hover:border-white'
                }`}
              >
                {displayCategory(cat)}
              </button>
            ))}
          </div>
        </div>
        <ProductCatalog products={filteredProducts} />
      </div>
    </>
  );
}
