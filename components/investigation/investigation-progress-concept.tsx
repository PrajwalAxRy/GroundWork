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

type PreviewState = 'running' | 'ready' | 'failed';
type PhaseState = 'complete' | 'active' | 'waiting' | 'failed';

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

function phaseState(index: number, preview: PreviewState): PhaseState {
  if (preview === 'ready') return 'complete';
  if (preview === 'failed') {
    if (index < 2) return 'complete';
    return index === 2 ? 'failed' : 'waiting';
  }
  if (index < 2) return 'complete';
  return index === 2 ? 'active' : 'waiting';
}

function PhaseMarker({ state }: { state: PhaseState }) {
  if (state === 'complete') return <Check aria-hidden="true" />;
  if (state === 'active') return <LoaderCircle aria-hidden="true" />;
  if (state === 'failed') return <AlertCircle aria-hidden="true" />;
  return <Circle aria-hidden="true" />;
}

export function InvestigationProgressConcept() {
  const [preview, setPreview] = useState<PreviewState>('running');
  const copy = previewCopy[preview];

  return (
    <ProductShell>
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
              <strong>A calmer inbox for small clinics</strong>
              <small>Investigation</small>
            </span>
          </div>

          <div className={styles.previewControls} aria-label="Preview state">
            <span>Concept view</span>
            {(['running', 'ready', 'failed'] as const).map((state) => (
              <button
                type="button"
                key={state}
                className={preview === state ? styles.selectedPreview : undefined}
                onClick={() => setPreview(state)}
                aria-pressed={preview === state}
              >
                {state}
              </button>
            ))}
          </div>
        </header>

        <div className={styles.content}>
          <section className={`${styles.statusLead} ${styles[preview]}`}>
            <span className={styles.statusIcon} aria-hidden="true">
              {preview === 'running' ? (
                <Search />
              ) : preview === 'ready' ? (
                <FileCheck2 />
              ) : (
                <AlertCircle />
              )}
            </span>
            <div>
              <p>{copy.eyebrow}</p>
              <h1>{copy.title}</h1>
              <span>{copy.description}</span>
            </div>
            {preview === 'ready' ? (
              <button className={styles.primaryAction} type="button">
                Read investigation
                <ArrowRight aria-hidden="true" />
              </button>
            ) : preview === 'failed' ? (
              <button className={styles.primaryAction} type="button">
                <RefreshCw aria-hidden="true" />
                Retry investigation
              </button>
            ) : null}
          </section>

          <section className={styles.progressSurface} aria-label="Investigation progress concept">
            <div className={styles.progressMain}>
              <div className={styles.sectionHeading}>
                <div>
                  <p>Research progress</p>
                  <h2>
                    {preview === 'ready' ? 'All checks complete' : 'What Groundwork is doing'}
                  </h2>
                </div>
                {preview === 'running' ? (
                  <span className={styles.liveLabel}>Working now</span>
                ) : null}
              </div>

              <ol className={styles.phaseList}>
                {phases.map((phase, index) => {
                  const state = phaseState(index, preview);
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

            <aside className={styles.contextRail}>
              <section>
                <div className={styles.railHeading}>
                  <Search aria-hidden="true" />
                  <h2>Activity</h2>
                </div>
                <dl className={styles.activityList}>
                  <div>
                    <dt>Sources reviewed</dt>
                    <dd>{preview === 'ready' ? '42' : preview === 'failed' ? '8' : '18'}</dd>
                  </div>
                  <div>
                    <dt>Sources kept</dt>
                    <dd>{preview === 'ready' ? '21' : preview === 'failed' ? '3' : '7'}</dd>
                  </div>
                  <div>
                    <dt>Competitors found</dt>
                    <dd>{preview === 'ready' ? '9' : preview === 'failed' ? '4' : '6'}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.creditNote}>
                <span aria-hidden="true">{preview === 'failed' ? <ShieldCheck /> : <Coins />}</span>
                <div>
                  <strong>
                    {preview === 'ready'
                      ? '5 credits used'
                      : preview === 'failed'
                        ? '5 credits released'
                        : '5 credits reserved'}
                  </strong>
                  <p>
                    {preview === 'running'
                      ? 'Finalized only when the report is ready.'
                      : preview === 'failed'
                        ? 'Nothing was charged for this run.'
                        : 'The investigation completed successfully.'}
                  </p>
                </div>
              </section>
            </aside>
          </section>

          <footer className={styles.pageFooter}>
            <Link href="/ideas">
              <ArrowLeft aria-hidden="true" />
              Return to Your ideas
            </Link>
            {preview === 'running' ? <span>Last checked just now</span> : null}
          </footer>
        </div>
      </main>
    </ProductShell>
  );
}
