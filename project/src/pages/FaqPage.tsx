import FAQ from '../components/FAQ';
import SEO, { faqSchema } from '../components/SEO';

const modules = import.meta.glob('../data/faq/*.json', { eager: true }) as Record<string, any>;

const faqItems = Object.values(modules)
  .map((mod: any) => {
    const data = mod.default ?? mod;
    return { ...data };
  })
  .filter(item => item.question);

export default function FaqPage() {
  return (
    <>
      <SEO
        title="FAQ"
        path="/faq"
        jsonLd={faqItems.length > 0 ? faqSchema(faqItems) : undefined}
      />
      <FAQ items={faqItems} />
    </>
  );
}
