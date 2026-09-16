'use client';

import { ProductShell } from '@/components/product/product-shell';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  FileText,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import styles from './shape-conversation-cards-experiment.module.css';

type Variant = {
  id: 'quiet' | 'soft' | 'document' | 'compact' | 'guided';
  number: string;
  name: string;
  description: string;
  note: string;
  recommended?: boolean;
};

const variants: Variant[] = [
  {
    id: 'quiet',
    number: '01',
    name: 'Quiet stack',
    description: 'Calm separation, lighter shadows, and familiar SaaS spacing.',
    note: 'Closest to the current direction',
  },
  {
    id: 'soft',
    number: '02',
    name: 'Soft surfaces',
    description: 'A warmer summary surface with a restrained blue detail card.',
    note: 'Friendliest and most approachable',
    recommended: true,
  },
  {
    id: 'document',
    number: '03',
    name: 'Working document',
    description: 'Crisper typography and flatter surfaces that feel more like a live brief.',
    note: 'Most content-focused',
  },
  {
    id: 'compact',
    number: '04',
    name: 'Compact utility',
    description: 'Tighter controls and denser spacing for a smaller supporting rail.',
    note: 'Best when chat needs more room',
  },
  {
    id: 'guided',
    number: '05',
    name: 'Guided progress',
    description: 'A little more status context without turning the brief into a dashboard.',
    note: 'Clearest sense of momentum',
  },
];

const details = [
  {
    label: 'Problem',
    value: 'Patient requests get lost across several channels.',
    state: 'Confirmed',
    tone: 'confirmed',
  },
  {
    label: 'Customer',
    value: 'Independent clinics with a small administrative team.',
    state: 'Suggested',
    tone: 'suggested',
  },
  {
    label: 'First version',
    value: 'How requests enter the shared queue still needs discussion.',
    state: 'Open',
    tone: 'open',
  },
] as const;

function StateIcon({ tone }: { tone: (typeof details)[number]['tone'] }) {
  if (tone === 'confirmed') return <CheckCircle2 aria-hidden="true" />;
  if (tone === 'suggested') return <Sparkles aria-hidden="true" />;
  return <CircleDashed aria-hidden="true" />;
}

function CardPair({ variant }: { variant: Variant }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.stage} ${styles[variant.id]}`}>
      <div className={styles.cardStack}>
        <section className={`${styles.card} ${styles.summaryCard}`}>
          <header className={styles.cardHeader}>
            <span className={styles.iconWrap} aria-hidden="true">
              <FileText />
            </span>
            <span className={styles.headingCopy}>
              <strong>Working summary</strong>
              <small>Updates as you talk</small>
            </span>
            {variant.id === 'guided' && <span className={styles.liveState}>Live</span>}
          </header>
          <div className={styles.summaryBody}>
            <p>
              Help small clinics keep patient requests visible and owned without replacing the tools
              their staff already use.
            </p>
            {variant.id === 'guided' && (
              <span className={styles.summaryMeta}>Last updated from your latest answer</span>
            )}
          </div>
        </section>

        <section className={`${styles.card} ${styles.detailsCard} ${open ? styles.expanded : ''}`}>
          <button
            type="button"
            className={styles.detailsToggle}
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
          >
            <span className={styles.iconWrap} aria-hidden="true">
              <ListChecks />
            </span>
            <span className={styles.headingCopy}>
              <strong>Captured details</strong>
              <small>4 details captured</small>
            </span>
            {variant.id === 'compact' && (
              <span className={styles.detailMarks} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            )}
            <ChevronDown className={styles.chevron} aria-hidden="true" />
          </button>

          {open && (
            <div className={styles.detailsBody}>
              {details.map((detail) => (
                <div className={styles.detail} key={detail.label}>
                  <div>
                    <strong>{detail.label}</strong>
                    <span className={styles[detail.tone]}>
                      <StateIcon tone={detail.tone} />
                      {detail.state}
                    </span>
                  </div>
                  <p>{detail.value}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export function ShapeConversationCardsExperiment() {
  return (
    <ProductShell>
      <main className={styles.page}>
        <nav className={styles.experimentNav} aria-label="Experiment navigation">
          <Link href="/_experiments/shape-conversation">
            <ArrowLeft aria-hidden="true" />
            Shape conversation
          </Link>
          <span>Development study</span>
        </nav>

        <header className={styles.pageHeader}>
          <div>
            <p className={styles.kicker}>Shape card study</p>
            <h1>Five ways to present the evolving idea</h1>
          </div>
          <p>
            The information and interaction stay the same. Only hierarchy, density, surface, and
            tone change.
          </p>
        </header>

        <section className={styles.gallery} aria-label="Idea Brief card iterations">
          {variants.map((variant) => (
            <article className={styles.study} key={variant.id}>
              <header className={styles.studyHeader}>
                <span className={styles.number}>{variant.number}</span>
                <div>
                  <div className={styles.titleLine}>
                    <h2>{variant.name}</h2>
                    {variant.recommended && <span>Recommended</span>}
                  </div>
                  <p>{variant.description}</p>
                </div>
                <small>{variant.note}</small>
              </header>
              <CardPair variant={variant} />
            </article>
          ))}
        </section>
      </main>
    </ProductShell>
  );
}
