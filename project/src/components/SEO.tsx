import { Helmet } from 'react-helmet-async';
import { useLang } from '../i18n/LanguageContext';

const SITE_URL = 'https://5am-store.netlify.app';
const SITE_NAME = '5AM STORE';
const OG_IMAGE = `${SITE_URL}/og-image.svg`;
const GSC_META = '5iHIvqJjG6y-KMAp97pyfsMKLotQhoxhmA_AFrXTCW8';

const LANG_MAP: Record<string, string> = {
  uk: 'uk',
  ru: 'ru',
  en: 'en',
};

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  path?: string;
  jsonLd?: Record<string, any>;
}

const defaultDesc: Record<string, string> = {
  uk: '5AM Store — преміальний дропчік та аксесуари. Купити брендовий одяг в Україні. Ресейл, 5ам, товарка. Щотижневе оновлення. Доставка по всій Україні.',
  ru: '5AM Store — премиальный дроп и аксессуары. Купить брендовую одежду в Украине. Ресейл, 5ам, товарка. Еженедельное обновление. Доставка по всей Украине.',
  en: '5AM Store — premium drops and accessories. Buy branded clothing in Ukraine. Resale. Weekly catalog updates. Delivery across Ukraine.',
};

export default function SEO({ title, description, ogImage, path = '', jsonLd }: SEOProps) {
  const { lang } = useLang();
  const langCode = LANG_MAP[lang] ?? 'uk';

  const pageTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Premium Resell`;
  const pageDesc = description ?? defaultDesc[lang] ?? defaultDesc.uk;
  const pageUrl = SITE_URL + path;
  const image = ogImage ?? OG_IMAGE;

  const schemas = jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang={langCode} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="keywords" content="5AM, 5-ам, ресейл, товарка, одежда Украина, бренды, streetwear, дроп, премиальный дроп, Киев, resell, Україна" />
      <meta name="google-site-verification" content={GSC_META} />
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href={pageUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={langCode === 'uk' ? 'uk_UA' : langCode === 'ru' ? 'ru_UA' : 'en_US'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={image} />

      <link rel="alternate" href={SITE_URL} hrefLang="uk" />
      <link rel="alternate" href={SITE_URL} hrefLang="ru" />
      <link rel="alternate" href={SITE_URL} hrefLang="en" />
      <link rel="alternate" href={SITE_URL} hrefLang="x-default" />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export function orgSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: '5AM STORE',
    url: SITE_URL,
    image: OG_IMAGE,
    description: defaultDesc.uk,
    address: { '@type': 'PostalAddress', addressLocality: 'Kyiv, Ukraine' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      url: 'https://t.me/store_5am',
    },
    sameAs: ['https://t.me/store_5am'],
  };
}

function getItemCondition(condition: string): string | undefined {
  if (condition === 'Новий' || condition.startsWith('10')) return 'https://schema.org/NewCondition';
  return 'https://schema.org/UsedCondition';
}

export function productSchema(product: {
  name: string;
  price: number;
  brand: string;
  category: string;
  images: string[];
  sizes?: string;
  description?: string;
  condition?: string;
  sold?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.[0] ?? OG_IMAGE,
    category: product.category,
    description: product.description || undefined,
    ...(product.sizes ? { size: product.sizes } : {}),
    brand: { '@type': 'Brand', name: product.brand || '5AM' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'UAH',
      availability: product.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
    ...(product.condition
      ? { itemCondition: getItemCondition(product.condition) }
      : {}),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: SITE_URL + item.path,
    })),
  };
}

export function itemListSchema(products: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        url: SITE_URL + p.url,
      },
    })),
  };
}
