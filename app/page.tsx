import type { Metadata } from 'next';
import Home from '@/components/sections/Home';
import JsonLd from '@/components/seo/JsonLd';
import { organizationSchema, faqSchema } from '@/lib/seo/schema';
import { site } from '@/lib/content/site';

export const metadata: Metadata = {
  title: 'KLARTEXT. — Marketingagentur',
  description: site.kurzprofil,
  alternates: { canonical: '/' },
};

export default function Page() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={faqSchema()} />
      <Home />
    </>
  );
}
