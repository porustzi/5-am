import { useState } from 'react';
import FAQ from '../components/FAQ';

const modules = import.meta.glob('../data/faq/*.json', { eager: true }) as Record<string, any>;

const loadedFaq = Object.values(modules).map((mod: any) => {
  const data = mod.default ?? mod;
  return {
    question: String(data.question ?? ''),
    answer: String(data.answer ?? ''),
  };
}).filter(item => item.question);

export default function FaqPage() {
  const [faqItems] = useState(loadedFaq);

  return (
    <div className="max-w-screen-xl mx-auto px-6 pt-24 pb-16">
      {faqItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-900 rounded-xl">
          <p className="text-zinc-600 font-mono text-xs tracking-widest uppercase">
            Список питань порожній.
          </p>
        </div>
      ) : (
        <FAQ items={faqItems} />
      )}
    </div>
  );
}
