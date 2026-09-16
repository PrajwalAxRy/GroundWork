'use client';

import {
  type InvestigationProgressStatus,
  InvestigationProgressView,
} from '@/components/investigation/investigation-progress-concept';
import { ProductShell } from '@/components/product/product-shell';
import { PROTOTYPE_INITIAL_CREDITS } from '@/lib/config/prototype-commercial';
import type { CreditBalance, Idea, ProductJob } from '@/lib/contracts/product';
import { mockProductService } from '@/lib/services/product-service';
import { AlertCircle, ArrowLeft, FlaskConical, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import styles from './investigation-progress-concept.module.css';

type LoadState = 'loading' | 'ready' | 'not_found' | 'no_job' | 'error';

function activePhaseIndex(job: ProductJob): number {
  if (job.state === 'awaiting_payment' || job.state === 'queued') return 0;
  if (job.state === 'verifying') return 4;
  if (job.state === 'assembling' || job.state === 'completed') return 5;

  const label = job.phaseLabel.toLowerCase();
  if (label.includes('competitor') || label.includes('alternative')) return 1;
  if (label.includes('customer') || label.includes('demand')) return 2;
  if (label.includes('business') || label.includes('feasibility')) return 3;
  if (label.includes('claim') || label.includes('source') || label.includes('evidence')) return 4;
  if (label.includes('report') || label.includes('assembl')) return 5;
  return job.state === 'failed' ? 2 : 1;
}

function presentation(job: ProductJob): {
  status: InvestigationProgressStatus;
  eyebrow: string;
  title: string;
  description: string;
} {
  if (job.state === 'completed') {
    return {
      status: 'ready',
      eyebrow: 'Investigation complete',
      title: 'Your report is ready',
      description: 'The research and evidence checks are complete.',
    };
  }

  if (job.state === 'failed') {
    return {
      status: 'failed',
      eyebrow: 'Investigation stopped',
      title: 'We couldn’t finish this run',
      description: 'Your reserved credits were released. You can safely try again.',
    };
  }

  if (job.state === 'queued' || job.state === 'awaiting_payment') {
    return {
      status: 'running',
      eyebrow: 'Investigation queued',
      title: 'Research is about to begin',
      description: 'You can leave this page. Your investigation will continue in the background.',
    };
  }

  if (job.state === 'verifying') {
    return {
      status: 'running',
      eyebrow: 'Investigation in progress',
      title: 'Checking evidence and sources',
      description: 'Groundwork is reviewing the research before preparing your report.',
    };
  }

  if (job.state === 'assembling') {
    return {
      status: 'running',
      eyebrow: 'Investigation in progress',
      title: 'Building your report',
      description: 'The research is complete. Groundwork is organizing the findings.',
    };
  }

  return {
    status: 'running',
    eyebrow: 'Investigation in progress',
    title: 'Research is underway',
    description: 'You can leave this page. Your investigation will keep running.',
  };
}

export function InvestigationProgressPageClient({ ideaId }: { ideaId: string }) {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [idea, setIdea] = useState<Idea | null>(null);
  const [job, setJob] = useState<ProductJob | null>(null);
  const [creditBalance, setCreditBalance] = useState<CreditBalance>({
    available: PROTOTYPE_INITIAL_CREDITS,
    reserved: 0,
  });
  const [retrying, setRetrying] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadState('loading');
    setActionError(null);
    try {
      const [loadedIdea, loadedJob, loadedBalance] = await Promise.all([
        mockProductService.getIdea(ideaId),
        mockProductService.getJob(ideaId, 'investigation'),
        mockProductService.getCreditBalance(),
      ]);
      setCreditBalance(loadedBalance);
      if (!loadedIdea) {
        setLoadState('not_found');
        return;
      }
      setIdea(loadedIdea);
      if (!loadedJob) {
        setLoadState('no_job');
        return;
      }
      setJob(loadedJob);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, [ideaId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function retryInvestigation() {
    if (retrying) return;
    setRetrying(true);
    setActionError(null);
    try {
      const result = await mockProductService.retryInvestigation(ideaId);
      setJob(result.job);
      setCreditBalance(result.creditBalance);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Investigation could not be retried. Your credits have not changed.',
      );
    } finally {
      setRetrying(false);
    }
  }

  if (loadState !== 'ready' || !idea || !job) {
    return (
      <InvestigationProgressRouteState
        kind={loadState === 'ready' ? 'error' : loadState}
        ideaId={ideaId}
        credits={creditBalance.available}
        onRetry={loadState === 'error' ? () => void load() : undefined}
      />
    );
  }

  const copy = presentation(job);

  return (
    <>
      <InvestigationProgressView
        ideaId={ideaId}
        ideaTitle={idea.title}
        status={copy.status}
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        activePhaseIndex={activePhaseIndex(job)}
        reservedCredits={job.reservedCredits}
        availableCredits={creditBalance.available}
        lastChecked={copy.status === 'running' ? 'Last checked just now' : undefined}
        retrying={retrying}
        onRetry={copy.status === 'failed' ? () => void retryInvestigation() : undefined}
      />
      {actionError ? (
        <p className={styles.floatingError} role="alert">
          <AlertCircle aria-hidden="true" />
          {actionError}
        </p>
      ) : null}
    </>
  );
}

export function InvestigationProgressRouteState({
  kind,
  ideaId,
  credits = PROTOTYPE_INITIAL_CREDITS,
  onRetry,
}: {
  kind: Exclude<LoadState, 'ready'>;
  ideaId: string;
  credits?: number;
  onRetry?: () => void;
}) {
  const isLoading = kind === 'loading';
  const title =
    kind === 'not_found'
      ? 'Idea not found'
      : kind === 'no_job'
        ? 'Investigation hasn’t started'
        : 'Status temporarily unavailable';
  const description =
    kind === 'not_found'
      ? 'This Idea may have been removed, or the link may be incorrect.'
      : kind === 'no_job'
        ? 'Return to Shape to review this Idea and start its Investigation.'
        : 'This does not mean the research failed. Try loading the latest status again.';

  return (
    <ProductShell credits={credits}>
      <main className={styles.routeState} aria-live="polite">
        <span className={styles.routeStateIcon} aria-hidden="true">
          {isLoading ? <FlaskConical /> : <AlertCircle />}
        </span>
        <h1>{isLoading ? 'Loading research progress…' : title}</h1>
        {isLoading ? (
          <div className={styles.routeStateSkeleton} aria-hidden="true" />
        ) : (
          <>
            <p>{description}</p>
            <div className={styles.routeStateActions}>
              <Link href={kind === 'no_job' ? `/idea/shape/${ideaId}` : '/ideas'}>
                <ArrowLeft aria-hidden="true" />
                {kind === 'no_job' ? 'Return to Shape' : 'Your ideas'}
              </Link>
              {onRetry ? (
                <button type="button" onClick={onRetry}>
                  <RotateCcw aria-hidden="true" />
                  Try again
                </button>
              ) : null}
            </div>
          </>
        )}
      </main>
    </ProductShell>
  );
}
