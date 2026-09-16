import { ShapeConversationExperiment } from '@/components/shape/shape-conversation-experiment';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shape conversation experiment',
  robots: { index: false, follow: false },
};

export default function ShapeConversationExperimentPage() {
  return <ShapeConversationExperiment />;
}
