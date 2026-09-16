'use client';

import { InvestigationProgressRouteState } from '@/components/investigation/investigation-progress-page-client';

export default function InvestigationProgressError({ reset }: { reset: () => void }) {
  return <InvestigationProgressRouteState kind="error" ideaId="unavailable" onRetry={reset} />;
}
