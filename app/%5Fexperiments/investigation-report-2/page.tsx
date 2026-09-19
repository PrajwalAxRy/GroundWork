import { InvestigationReport2Concept } from '@/components/investigation/investigation-report-2-concept';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investigation report layout concept',
  robots: { index: false, follow: false },
};

export default function InvestigationReport2ConceptPage() {
  return <InvestigationReport2Concept />;
}
