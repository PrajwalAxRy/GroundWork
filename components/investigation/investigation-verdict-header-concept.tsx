'use client';

import { ProductShell } from '@/components/product/product-shell';
import {
  type EvidenceCoverageStatus,
  type EvidencePreviewKey,
  type VerdictLabel,
  type VerdictScenarioKey,
  evidencePreviews,
  verdictScenarios,
} from '@/lib/fixtures/investigation-verdict-header';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  Check,
  CheckCircle2,
  CircleDashed,
  CircleOff,
  FileText,
  FlaskConical,
  Lightbulb,
  Minus,
  SlidersHorizontal,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import styles from './investigation-verdict-header-concept.module.css';

const verdictOptions = Object.values(verdictScenarios);
const evidenceOptions = Object.values(evidencePreviews);

const coverageCopy: Record<EvidenceCoverageStatus, string> = {
  complete: 'Complete',
  partial: 'Partial',
  insufficient_evidence: 'Insufficient evidence',
  not_applicable: 'Not applicable',
};

function VerdictIcon({ label }: { label: VerdictLabel }) {
  if (label === 'Worth pursuing') return <CheckCircle2 aria-hidden="true" />;
  if (label === 'Refine before pursuing') return <SlidersHorizontal aria-hidden="true" />;
  if (label === 'Test the critical assumption') return <Target aria-hidden="true" />;
  if (label === 'Major obstacles') return <AlertTriangle aria-hidden="true" />;
  return <Ban aria-hidden="true" />;
}

function CoverageIcon({ status }: { status: EvidenceCoverageStatus }) {
  if (status === 'complete') return <Check aria-hidden="true" />;
  if (status === 'partial') return <Minus aria-hidden="true" />;
  if (status === 'insufficient_evidence') return <CircleDashed aria-hidden="true" />;
  return <CircleOff aria-hidden="true" />;
}

export function InvestigationVerdictHeaderConcept() {
  const [scenarioKey, setScenarioKey] = useState<VerdictScenarioKey>('refine_before_pursuing');
  const [evidenceKey, setEvidenceKey] = useState<EvidencePreviewKey>('mixed');
  const scenario = verdictScenarios[scenarioKey];
  const evidence = evidencePreviews[evidenceKey];

  return (
    <ProductShell credits={10}>
      <main className={styles.page}>
        <header className={styles.utilityBar}>
          <div className={styles.utilityLeft}>
            <Link className={styles.backLink} href="/ideas" aria-label="Return to Your ideas">
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

          <div className={styles.previewControls} aria-label="Experiment preview controls">
            <span className={styles.previewLabel}>Prototype states</span>
            <label className={styles.selectControl}>
              <span>Verdict</span>
              <select
                value={scenarioKey}
                onChange={(event) => setScenarioKey(event.target.value as VerdictScenarioKey)}
              >
                {verdictOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.evidenceToggle} aria-label="Evidence coverage preview">
              {evidenceOptions.map((option) => (
                <button
                  type="button"
                  key={option.key}
                  aria-pressed={evidenceKey === option.key}
                  onClick={() => setEvidenceKey(option.key)}
                >
                  {option.key}
                </button>
              ))}
            </div>
          </div>
        </header>

        <article className={styles.report} aria-labelledby="verdict-heading">
          <header className={styles.reportMeta}>
            <div>
              <p>Investigation conclusion</p>
              <span>United States · Researched 16 September 2026</span>
            </div>
            <Link href="/idea/shape/idea-03" aria-label="Read Shape transcript">
              <FileText aria-hidden="true" />
              <span>Read Shape transcript</span>
            </Link>
          </header>

          <div className={styles.heroGrid}>
            <section className={`${styles.verdict} ${styles[scenario.tone]}`}>
              <div className={styles.verdictLabel}>
                <span className={styles.verdictIcon}>
                  <VerdictIcon label={scenario.label} />
                </span>
                <div>
                  <span>Verdict</span>
                  <strong>{scenario.label}</strong>
                </div>
                <span className={styles.confidence}>{evidence.confidence}</span>
              </div>

              <h1 id="verdict-heading">{scenario.headline}</h1>
              <p className={styles.summary}>{scenario.summary}</p>

              <div className={styles.reasons}>
                <h2>Why Groundwork reached this verdict</h2>
                <ol>
                  {scenario.reasons.map((reason, index) => (
                    <li key={reason}>
                      <span aria-hidden="true">{index + 1}</span>
                      <p>{reason}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <aside className={styles.evidencePanel} aria-labelledby="evidence-title">
              <div className={styles.evidenceHeading}>
                <div>
                  <span>Evidence coverage</span>
                  <h2 id="evidence-title">{evidence.label}</h2>
                </div>
                <span
                  className={`${styles.coverageMark} ${styles[evidence.key]}`}
                  aria-hidden="true"
                >
                  {evidence.key === 'good' ? (
                    <CheckCircle2 />
                  ) : evidence.key === 'mixed' ? (
                    <CircleDashed />
                  ) : (
                    <AlertTriangle />
                  )}
                </span>
              </div>
              <p>{evidence.summary}</p>
              <ul>
                {evidence.areas.map((area) => (
                  <li key={area.label} className={styles[area.status]}>
                    <span className={styles.coverageIcon}>
                      <CoverageIcon status={area.status} />
                    </span>
                    <span>{area.label}</span>
                    <strong>{coverageCopy[area.status]}</strong>
                  </li>
                ))}
              </ul>
              <small>Missing evidence lowers confidence. It is never filled with a guess.</small>
            </aside>
          </div>

          <div className={styles.decisionDetails}>
            <section className={styles.concern}>
              <span className={styles.detailIcon} aria-hidden="true">
                <AlertTriangle />
              </span>
              <div>
                <p>Strongest concern</p>
                <h2>{scenario.concern.title}</h2>
                <span>{scenario.concern.body}</span>
              </div>
            </section>

            <section className={styles.recommendation}>
              <span className={styles.detailIcon} aria-hidden="true">
                <Lightbulb />
              </span>
              <div>
                <p>Recommended version</p>
                <h2>{scenario.recommendation.title}</h2>
                <span>{scenario.recommendation.body}</span>
                <small>{scenario.recommendation.retained}</small>
              </div>
            </section>
          </div>

          <section className={styles.nextMove} aria-labelledby="next-move-title">
            <span>Best immediate next action</span>
            <div>
              <div>
                <h2 id="next-move-title">{scenario.nextAction.title}</h2>
                <p>{scenario.nextAction.body}</p>
              </div>
              <button type="button">
                See the decision drivers
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </section>
        </article>
      </main>
    </ProductShell>
  );
}
