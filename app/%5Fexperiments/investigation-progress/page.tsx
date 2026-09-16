import { InvestigationProgressConcept } from '@/components/investigation/investigation-progress-concept';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investigation progress concept',
  robots: { index: false, follow: false },
};

export default function InvestigationProgressConceptPage() {
  return <InvestigationProgressConcept />;
}
