'use client';

import { ProductShell } from '@/components/product/product-shell';
import {
  ArrowLeft,
  BookOpenText,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  FileText,
  Layers3,
  ListChecks,
  PanelRight,
  Rows3,
  Sparkles,
  StickyNote,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import styles from './shape-conversation-cards-experiment.module.css';

type Variant = {
  id: 'quiet' | 'hairline' | 'typeled' | 'tonal' | 'compact';
  number: string;
  name: string;
  description: string;
  note: string;
  recommended?: boolean;
};

type ConceptVariant = {
  id: 'memo' | 'sidepeek' | 'blocks' | 'ledger' | 'tucked';
  number: string;
  name: string;
  description: string;
  note: string;
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
    id: 'hairline',
    number: '02',
    name: 'Hairline',
    description: 'No shadow, smaller icons, and a single crisp border around each card.',
    note: 'Cleanest balance',
    recommended: true,
  },
  {
    id: 'typeled',
    number: '03',
    name: 'Type-led',
    description: 'Icons disappear so the hierarchy comes entirely from type and spacing.',
    note: 'Most minimal',
  },
  {
    id: 'tonal',
    number: '04',
    name: 'Single tone',
    description: 'Each card becomes one continuous surface with fewer internal rules.',
    note: 'Softest visual weight',
  },
  {
    id: 'compact',
    number: '05',
    name: 'Compact minimal',
    description: 'The same quiet treatment with less height and tighter supporting text.',
    note: 'Leaves the most room for chat',
  },
];

const conceptVariants: ConceptVariant[] = [
  {
    id: 'memo',
    number: '06',
    name: 'Living memo',
    description: 'The summary becomes a small working document instead of a conventional card.',
    note: 'Inspired by collaborative canvases',
  },
  {
    id: 'sidepeek',
    number: '07',
    name: 'Side peek',
    description: 'The second card steps inward like a supporting drawer attached to the summary.',
    note: 'Strongest connection to the chat',
  },
  {
    id: 'blocks',
    number: '08',
    name: 'Canvas blocks',
    description: 'Summary and captured information behave like simple reusable content blocks.',
    note: 'Most scannable',
  },
  {
    id: 'ledger',
    number: '09',
    name: 'Brief ledger',
    description: 'Numbered sections make the two parts feel like one concise working brief.',
    note: 'Clearest information order',
  },
  {
    id: 'tucked',
    number: '10',
    name: 'Tucked stack',
    description: 'Captured details sits partly behind the summary until the user needs it.',
    note: 'Smallest resting footprint',
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
          </header>
          <div className={styles.summaryBody}>
            <p>
              Help small clinics keep patient requests visible and owned without replacing the tools
              their staff already use.
            </p>
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

function ConceptIcon({ id }: { id: ConceptVariant['id'] }) {
  if (id === 'memo') return <StickyNote aria-hidden="true" />;
  if (id === 'sidepeek') return <PanelRight aria-hidden="true" />;
  if (id === 'blocks') return <Rows3 aria-hidden="true" />;
  if (id === 'ledger') return <BookOpenText aria-hidden="true" />;
  return <Layers3 aria-hidden="true" />;
}

function ConceptPair({ variant }: { variant: ConceptVariant }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.stage} ${styles.conceptStage} ${styles[variant.id]}`}>
      <div className={styles.conceptStack}>
        <section className={`${styles.conceptCard} ${styles.conceptSummary}`}>
          <div className={styles.conceptTopline}>
            {variant.id === 'ledger' ? (
              <span className={styles.conceptNumber}>01</span>
            ) : (
              <span className={styles.conceptIcon}>
                <ConceptIcon id={variant.id} />
              </span>
            )}
            <span className={styles.conceptLabel}>Working summary</span>
            <span className={styles.updated}>Updated now</span>
          </div>
          <p>
            Help small clinics keep patient requests visible and owned without replacing the tools
            their staff already use.
          </p>
          {variant.id === 'memo' && (
            <span className={styles.memoFoot}>A working note shaped by your conversation</span>
          )}
        </section>

        <section
          className={`${styles.conceptCard} ${styles.conceptDetails} ${
            open ? styles.conceptExpanded : ''
          }`}
        >
          <button
            type="button"
            className={styles.conceptToggle}
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
          >
            {variant.id === 'ledger' ? (
              <span className={styles.conceptNumber}>02</span>
            ) : (
              <span className={styles.conceptIcon}>
                <ListChecks aria-hidden="true" />
              </span>
            )}
            <span className={styles.conceptToggleCopy}>
              <strong>Captured details</strong>
              <small>4 details</small>
            </span>
            {variant.id === 'blocks' && (
              <span className={styles.blockPreview}>Problem · Customer · Offer</span>
            )}
            <ChevronDown className={styles.chevron} aria-hidden="true" />
          </button>

          {open && (
            <div className={styles.conceptDetailsBody}>
              {details.map((detail) => (
                <div className={styles.conceptDetail} key={detail.label}>
                  <span>
                    <StateIcon tone={detail.tone} />
                    <strong>{detail.label}</strong>
                  </span>
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
            <p className={styles.kicker}>Minimal card study</p>
            <h1>Five quieter versions of the card stack</h1>
          </div>
          <p>
            Quiet stack remains the reference. Each option removes a different layer of visual
            treatment while keeping the same information and interaction.
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

          <header className={styles.conceptIntro}>
            <p className={styles.kicker}>From-scratch concepts</p>
            <h2>Five different ways to structure the brief</h2>
            <p>
              These move beyond surface styling and reconsider how the two pieces relate to each
              other inside the chat workspace.
            </p>
          </header>

          {conceptVariants.map((variant) => (
            <article className={styles.study} key={variant.id}>
              <header className={styles.studyHeader}>
                <span className={styles.number}>{variant.number}</span>
                <div>
                  <div className={styles.titleLine}>
                    <h2>{variant.name}</h2>
                  </div>
                  <p>{variant.description}</p>
                </div>
                <small>{variant.note}</small>
              </header>
              <ConceptPair variant={variant} />
            </article>
          ))}
        </section>
      </main>
    </ProductShell>
  );
}
