import { ShapeConversationExperiment } from '@/components/shape/shape-conversation-experiment';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shape' };

export default function NewIdeaShapePage() {
  return <ShapeConversationExperiment mode="product" />;
}
