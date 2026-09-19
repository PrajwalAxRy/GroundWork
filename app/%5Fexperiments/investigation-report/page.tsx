import { InvestigationReportConcept } from '@/components/investigation/investigation-report-concept';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investigation report concept',
  robots: { index: false, follow: false },
};

export default function InvestigationReportConceptPage() {
  return <InvestigationReportConcept />;
}
