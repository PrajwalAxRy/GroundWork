import { ShapeConversationCardsExperiment } from '@/components/shape/shape-conversation-cards-experiment';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shape card iterations',
  robots: { index: false, follow: false },
};

export default function ShapeConversationCardsExperimentPage() {
  return <ShapeConversationCardsExperiment />;
}
