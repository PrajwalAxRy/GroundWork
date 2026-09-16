import { InvestigationVerdictHeaderConcept } from '@/components/investigation/investigation-verdict-header-concept';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investigation verdict header concept',
  robots: { index: false, follow: false },
};

export default function InvestigationVerdictHeaderConceptPage() {
  return <InvestigationVerdictHeaderConcept />;
}
