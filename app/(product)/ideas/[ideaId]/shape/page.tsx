import { ShapePageClient } from '@/components/shape/shape-page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shape your idea' };

export default async function ShapePage({
  params,
  searchParams,
}: {
  params: Promise<{ ideaId: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
}) {
  const [{ ideaId }, query] = await Promise.all([params, searchParams]);
  return (
    <ShapePageClient
      ideaId={ideaId}
      preview={typeof query.preview === 'string' ? query.preview : undefined}
    />
  );
}
