import { ShapePageClient } from '@/components/shape/shape-page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shape' };

export default async function ExistingIdeaShapePage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const { ideaId } = await params;
  return <ShapePageClient ideaId={ideaId} />;
}
