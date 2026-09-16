import { InvestigationProgressPageClient } from '@/components/investigation/investigation-progress-page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investigation progress',
};

export default async function InvestigationProgressPage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const { ideaId } = await params;
  return <InvestigationProgressPageClient ideaId={ideaId} />;
}
