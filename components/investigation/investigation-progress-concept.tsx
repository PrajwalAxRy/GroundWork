'use client';

import { ProductShell } from '@/components/product/product-shell';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  Coins,
  FileCheck2,
  FlaskConical,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import styles from './investigation-progress-concept.module.css';

export type InvestigationProgressStatus = 'running' | 'ready' | 'failed';
type PhaseState = 'complete' | 'active' | 'waiting' | 'failed';

type InvestigationProgressViewProps = {
  ideaId: string;
  ideaTitle: string;
  status: InvestigationProgressStatus;
  eyebrow: string;
  title: string;
  description: string;
  activePhaseIndex: number;
  reservedCredits: number;
  availableCredits: number;
  lastChecked?: string;
  retrying?: boolean;
  onRetry?: () => void;
  onPreviewChange?: (status: InvestigationProgressStatus) => void;
};

const phases = [
  'Research plan',
  'Competitors',
  'Customer evidence',
  'Business reality',
  'Evidence check',
  'Final report',
] as const;

const previewCopy = {
  running: {
    eyebrow: 'Investigation in progress',
    title: 'Research is underway',
    description: 'You can leave this page. Your investigation will keep running.',
  },
  ready: {
    eyebrow: 'Investigation complete',
    title: 'Your report is ready',
    description: 'The research and evidence checks are complete.',
  },
  failed: {
    eyebrow: 'Investigation stopped',
    title: 'We couldn’t finish this run',
    description: 'Your reserved credits were released. You can safely try again.',
  },
} as const;

function phaseState(
  index: number,
  status: InvestigationProgressStatus,
  activePhaseIndex: number,
): PhaseState {
  if (status === 'ready') return 'complete';
  if (index < activePhaseIndex) return 'complete';
  if (index === activePhaseIndex) return status === 'failed' ? 'failed' : 'active';
  return 'waiting';
}

function PhaseMarker({ state }: { state: PhaseState }) {
  if (state === 'complete') return <Check aria-hidden="true" />;
  if (state === 'active') return <LoaderCircle aria-hidden="true" />;
  if (state === 'failed') return <AlertCircle aria-hidden="true" />;
  return <Circle aria-hidden="true" />;
}

export function InvestigationProgressView({
  ideaId,
  ideaTitle,
  status,
  eyebrow,
  title,
  description,
  activePhaseIndex,
  reservedCredits,
  availableCredits,
  lastChecked,
  retrying = false,
  onRetry,
  onPreviewChange,
}: InvestigationProgressViewProps) {
  return (
    <ProductShell credits={availableCredits}>
      <main className={styles.page}>
        <header className={styles.utilityBar}>
          <div className={styles.utilityLeft}>
            <Link className={styles.backLink} href="/ideas">
              <ArrowLeft aria-hidden="true" />
              <span>Your ideas</span>
            </Link>
            <span className={styles.divider} aria-hidden="true" />
            <span className={styles.ideaIcon} aria-hidden="true">
              <FlaskConical />
            </span>
            <span className={styles.ideaIdentity}>
              <strong>{ideaTitle}</strong>
              <small>Investigation</small>
            </span>
          </div>

          {onPreviewChange ? (
            <div className={styles.previewControls} aria-label="Preview state">
              <span>Concept view</span>
              {(['running', 'ready', 'failed'] as const).map((state) => (
                <button
                  type="button"
                  key={state}
                  className={status === state ? styles.selectedPreview : undefined}
                  onClick={() => onPreviewChange(state)}
                  aria-pressed={status === state}
                >
                  {state}
                </button>
              ))}
            </div>
          ) : null}
        </header>

        <div className={styles.content}>
          <section className={`${styles.statusLead} ${styles[status]}`}>
            <span className={styles.statusIcon} aria-hidden="true">
              {status === 'running' ? (
                <Search />
              ) : status === 'ready' ? (
                <FileCheck2 />
              ) : (
                <AlertCircle />
              )}
            </span>
            <div>
              <p>{eyebrow}</p>
              <h1>{title}</h1>
              <span>{description}</span>
            </div>
            {status === 'ready' ? (
              <Link className={styles.primaryAction} href={`/idea/investigate/${ideaId}`}>
                Read investigation
                <ArrowRight aria-hidden="true" />
              </Link>
            ) : status === 'failed' && onRetry ? (
              <button
                className={styles.primaryAction}
                type="button"
                onClick={onRetry}
                disabled={retrying}
              >
                <RefreshCw aria-hidden="true" />
                {retrying ? 'Retrying…' : 'Retry investigation'}
              </button>
            ) : null}
          </section>

          <section
            className={`${styles.progressSurface} ${styles[status]}`}
            aria-label="Investigation progress"
          >
            <div className={styles.progressMain}>
              <div className={styles.sectionHeading}>
                <div>
                  <p>Research progress</p>
                  <h2>{status === 'ready' ? 'All checks complete' : 'What Groundwork is doing'}</h2>
                </div>
                {status === 'running' ? (
                  <span className={styles.liveLabel}>Working now</span>
                ) : null}
              </div>

              <ol className={styles.phaseList}>
                {phases.map((phase, index) => {
                  const state = phaseState(index, status, activePhaseIndex);
                  return (
                    <li className={styles[state]} key={phase}>
                      <span className={styles.marker}>
                        <PhaseMarker state={state} />
                      </span>
                      <span className={styles.phaseCopy}>
                        <strong>{phase}</strong>
                        {state === 'active' ? <small>Looking for useful signals</small> : null}
                        {state === 'failed' ? <small>Could not complete</small> : null}
                      </span>
                      <span className={styles.phaseState}>
                        {state === 'complete'
                          ? 'Done'
                          : state === 'active'
                            ? 'In progress'
                            : state === 'failed'
                              ? 'Stopped'
                              : 'Waiting'}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className={styles.creditNote}>
              <span aria-hidden="true">{status === 'failed' ? <ShieldCheck /> : <Coins />}</span>
              <div>
                <strong>
                  {status === 'ready'
                    ? `${reservedCredits} credits used`
                    : status === 'failed'
                      ? `${reservedCredits} credits released`
                      : `${reservedCredits} credits reserved`}
                </strong>
                <p>
                  {status === 'running'
                    ? 'Finalized only when the report is ready.'
                    : status === 'failed'
                      ? 'Nothing was charged for this run.'
                      : 'The investigation completed successfully.'}
                </p>
              </div>
            </div>
          </section>

          <footer className={styles.pageFooter}>
            <Link href="/ideas">
              <ArrowLeft aria-hidden="true" />
              Return to Your ideas
            </Link>
            {lastChecked ? <span>{lastChecked}</span> : null}
          </footer>
        </div>
      </main>
    </ProductShell>
  );
}

export function InvestigationProgressConcept() {
  const [preview, setPreview] = useState<InvestigationProgressStatus>('running');
  const copy = previewCopy[preview];

  return (
    <InvestigationProgressView
      ideaId="idea-03"
      ideaTitle="A calmer inbox for small clinics"
      status={preview}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      activePhaseIndex={2}
      reservedCredits={5}
      availableCredits={10}
      lastChecked={preview === 'running' ? 'Last checked just now' : undefined}
      onRetry={() => setPreview('running')}
      onPreviewChange={setPreview}
    />
  );
}
