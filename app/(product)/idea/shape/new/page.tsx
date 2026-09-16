import { NewShapePageClient } from '@/components/shape/new-shape-page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shape' };

export default function NewIdeaShapePage() {
  return <NewShapePageClient />;
}
