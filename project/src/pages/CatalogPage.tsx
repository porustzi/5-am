import { useState } from 'react';
import ProductCatalog from '../components/ProductCatalog';
import type { Product } from '../components/ProductCatalog';

const modules = import.meta.glob('../data/live_products/*.json', { eager: true }) as Record<string, any>;

const loadedProducts = Object.values(modules).map((mod: any) => {
  const data = mod.default ? mod.default : mod;
  
  // Жестко страхуем каждое поле, приводя к строке/числу, чтобы внутренние .replace() в компонентах не падали
  return {
    id: String(data.id || Math.random().toString()),
    title_ru: String(data.title_ru || 'Без названия'),
    title_en: String(data.title_en || data.title_ru || 'No title'),
    price: Number(data.price || 0),
    image: String(data.image || '/images/uploads/default.jpg'), // Если картинки нет, даем заглушку
    description_ru: String(data.description_ru || ''),
    description_en: String(data.description_en || ''),
    inStock: Boolean(data.inStock !== false)
  };
}) as Product[];

export default function CatalogPage() {
  const [products] = useState<Product[]>(loadedProducts);

  return (
    <div className="max-w-screen-xl mx-auto px-6 pt-24 pb-16">
      {products.length === 0 ? (
        <div>
          <div className="mb-10">
            <p className="text-zinc-600 font-mono text-xs tracking-widest uppercase mb-3">КАТАЛОГ</p>
            <h1 className="text-white font-black text-5xl md:text-6xl tracking-tight leading-none uppercase">
              КОЛЕКЦІЯ
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-900 rounded-xl">
            <p className="text-zinc-600 font-mono text-xs tracking-widest uppercase">
              Каталог порожній. Додайте товари через адмін-панель.
            </p>
          </div>
        </div>
      ) : (
        <ProductCatalog products={products} />
      )}
    </div>
  );
}
