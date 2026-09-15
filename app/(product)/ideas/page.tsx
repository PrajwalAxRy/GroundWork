import { IdeasPageClient } from '@/components/ideas/ideas-page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Your ideas' };

const previews = new Set(['populated', 'empty', 'loading', 'error']);

export default async function IdeasPage({
  searchParams,
}: { searchParams: Promise<{ state?: string | string[] }> }) {
  const requested = (await searchParams).state;
  const preview =
    typeof requested === 'string' && previews.has(requested) ? requested : 'populated';
  return (
    <IdeasPageClient initialPreview={preview as 'populated' | 'empty' | 'loading' | 'error'} />
  );
}
