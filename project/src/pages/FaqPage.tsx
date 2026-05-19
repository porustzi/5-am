import { useState } from 'react';
import FAQ from '../components/FAQ';
import faqData from '../data/faq.json';

export default function FaqPage() {
  const rawItems = (faqData as any)?.faq?.items || (faqData as any)?.items || [];

  const formattedFaqItems = Array.isArray(rawItems)
    ? rawItems
        .filter((item: any) => item && (item.question_ru || item.question_en)) // Фильтруем совсем пустые объекты
        .map((item: any) => ({
          question: String(item.question_ru || item.question_en || ''),
          answer: String(item.answer_ru || item.answer_en || '')
        }))
    : [];

  const [faqItems] = useState<any[]>(formattedFaqItems);

  return (
    <div className="max-w-screen-xl mx-auto px-6 pt-24 pb-16">
      {faqItems.length === 0 ? (
        <div>
          <div className="mb-10">
            <p className="text-zinc-600 font-mono text-xs tracking-widest uppercase mb-3">FAQ</p>
            <h1 className="text-white font-black text-5xl md:text-6xl tracking-tight leading-none uppercase">
              Часті питання
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-900 rounded-xl">
            <p className="text-zinc-600 font-mono text-xs tracking-widest uppercase">
              Список питань порожній. Додайте їх через адмін-панель.
            </p>
          </div>
        </div>
      ) : (
        <FAQ items={faqItems} />
      )}
    </div>
  );
}
