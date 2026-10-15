'use client';

import { ProductShell } from '@/components/product/product-shell';
import { investigationReport } from '@/lib/fixtures/investigation-report';
import * as Dialog from '@radix-ui/react-dialog';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Coins,
  FileText,
  Menu as MenuIcon,
  Minus,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  Users,
  X,
} from 'lucide-react';
import { Fraunces, JetBrains_Mono, Newsreader } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './investigation-report-concept.module.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '900'],
  style: ['normal', 'italic'],
  variable: '--font-dossier-display',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dossier-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dossier-mono',
  display: 'swap',
});

const data = investigationReport;

const sections = [
  { id: 'decision-drivers', letter: 'A', label: 'Decision drivers' },
  { id: 'customer-evidence', letter: 'B', label: 'Customer and problem evidence' },
  { id: 'competitive-landscape', letter: 'C', label: 'Competitive landscape' },
  { id: 'demand-signals', letter: 'D', label: 'Demand and market signals' },
  { id: 'business-model', letter: 'E', label: 'Business model' },
  { id: 'feasibility', letter: 'F', label: 'Feasibility and difficulty' },
  { id: 'risks', letter: 'G', label: 'Critical assumptions and risks' },
  { id: 'refinement', letter: 'H', label: 'Recommended refinement' },
  { id: 'verdict-changers', letter: 'I', label: 'What would change the verdict' },
  { id: 'optional-section', letter: 'J', label: data.sections.optionalSection.title },
  { id: 'sources', letter: 'K', label: 'Case references' },
  { id: 'continue', letter: 'L', label: 'Continue from here' },
] as const;

function VerdictIcon({ label }: { label: string }) {
  if (label === 'Worth pursuing') return <CheckCircle2 aria-hidden="true" />;
  if (label === 'Refine before pursuing') return <SlidersHorizontal aria-hidden="true" />;
  if (label === 'Test the critical assumption') return <Target aria-hidden="true" />;
  if (label === 'Major obstacles') return <AlertTriangle aria-hidden="true" />;
  return <X aria-hidden="true" />;
}

function verdictTone(label: string): 'green' | 'amber' | 'red' {
  if (label === 'Worth pursuing') return 'green';
  if (label === 'Major obstacles' || label === 'Reconsider this version') return 'red';
  return 'amber';
}

function ratingTone(rating: 'Low' | 'Moderate' | 'High'): 'green' | 'amber' | 'red' {
  if (rating === 'Low') return 'green';
  if (rating === 'Moderate') return 'amber';
  return 'red';
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return progress;
}

function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function DocketLinks({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <ol className={styles.docketList}>
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            aria-current={active === section.id ? 'true' : undefined}
            onClick={onNavigate}
          >
            <span className={styles.docketLetter}>{section.letter}</span>
            <span>{section.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

function MobileDocket({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className={styles.docketTrigger}>
          <MenuIcon aria-hidden="true" />
          <span>Docket</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.sheetOverlay} />
        <Dialog.Content className={styles.sheetContent} aria-describedby={undefined}>
          <div className={styles.sheetHeader}>
            <Dialog.Title>Case docket</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close docket">
                <X aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <DocketLinks active={active} onNavigate={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ExpandableRow({
  primary,
  rating,
  detail,
}: {
  primary: string;
  rating?: 'Low' | 'Moderate' | 'High';
  detail: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li className={styles.expandableRow}>
      <button
        type="button"
        className={styles.expandableTrigger}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.expandableMain}>
          <strong>{primary}</strong>
          {rating ? (
            <span className={styles.ratingTag} data-tone={ratingTone(rating)}>
              {rating}
            </span>
          ) : null}
        </span>
        <ChevronDown aria-hidden="true" className={open ? styles.chevronOpen : undefined} />
      </button>
      {open ? <p className={styles.expandableDetail}>{detail}</p> : null}
    </li>
  );
}

function RiskRow({ item }: { item: (typeof data.sections.risks.items)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={styles.expandableRow}>
      <button
        type="button"
        className={styles.expandableTrigger}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.expandableMain}>
          <strong>{item.title}</strong>
          <span className={styles.rowTags}>
            <span className={styles.ratingTag} data-tone={ratingTone(item.impact)}>
              {item.impact} impact
            </span>
            {item.blocksBuilding ? <span className={styles.blockTag}>Blocks building</span> : null}
          </span>
        </span>
        <ChevronDown aria-hidden="true" className={open ? styles.chevronOpen : undefined} />
      </button>
      {open ? (
        <div className={styles.expandableDetail}>
          <p>{item.whyItMatters}</p>
          <p className={styles.cheapestTest}>
            <Target aria-hidden="true" />
            <span>Cheapest test: {item.cheapestTest}</span>
          </p>
          <p className={styles.evidenceStrength}>Evidence strength: {item.evidenceStrength}</p>
        </div>
      ) : null}
    </li>
  );
}

function CaseReferences() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.references}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>Sources examined ({data.sources.length})</span>
        <ChevronDown aria-hidden="true" className={open ? styles.chevronOpen : undefined} />
      </button>
      {open ? (
        <ol className={styles.referenceList}>
          {data.sources.map((source, index) => (
            <li key={source.title}>
              <span className={styles.referenceMark}>[{index + 1}]</span>
              <span className={styles.referenceBody}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                </a>
                <span className={styles.referenceMeta}>
                  {source.publisher} · {source.section}
                </span>
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export function InvestigationReportConcept() {
  const active = useScrollSpy(sections.map((s) => s.id));
  const progress = useReadingProgress();
  const { sections: s } = data;
  const tone = verdictTone(data.verdict);

  return (
    <ProductShell credits={12}>
      <div
        className={`${styles.page} ${fraunces.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
        data-tone={tone}
      >
        <div className={styles.progressBar} aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <header className={styles.utilityBar}>
          <div className={styles.utilityLeft}>
            <Link className={styles.backLink} href="/ideas" aria-label="Return to Your ideas">
              <ArrowLeft aria-hidden="true" />
              <span>Your ideas</span>
            </Link>
            <span className={styles.divider} aria-hidden="true" />
            <span className={styles.dossierNo}>
              Dossier No. {data.ideaId.replace(/\D/g, '') || '01'}
            </span>
          </div>
          <div className={styles.utilityRight}>
            <Link href={data.shapeTranscriptHref} className={styles.transcriptLink}>
              <FileText aria-hidden="true" />
              <span>Read Shape transcript</span>
            </Link>
            <MobileDocket active={active} />
          </div>
        </header>

        <div className={styles.layout}>
          <nav className={styles.docket} aria-label="Case docket">
            <span className={styles.docketMeta}>
              {data.geography} · Filed {data.researchDate}
            </span>
            <DocketLinks active={active} />
          </nav>

          <main className={styles.content}>
            {/* Hero: the verdict, stamped */}
            <section className={styles.hero} aria-labelledby="verdict-heading">
              <p className={styles.heroEyebrow}>Investigation dossier</p>
              <h2 className={styles.ideaTitle}>{data.ideaTitle}</h2>

              <div className={styles.stampRow}>
                <div className={styles.stamp}>
                  <span className={styles.stampGrain} aria-hidden="true" />
                  <span className={styles.stampIcon}>
                    <VerdictIcon label={data.verdict} />
                  </span>
                  <h1 id="verdict-heading" className={styles.stampVerdict}>
                    {data.verdict}
                  </h1>
                </div>
                <p className={styles.confidence}>{data.confidence}</p>
              </div>

              <p className={styles.verdictReasoning}>{data.verdictReasoning}</p>

              <ul className={styles.reasonsList}>
                {data.strongestReasons.map((reason) => (
                  <li key={reason}>
                    <Check aria-hidden="true" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>

              <p className={styles.concernBox}>
                <AlertTriangle aria-hidden="true" />
                <span>{data.strongestConcern}</span>
              </p>

              <div className={styles.recommendationCard}>
                <p className={styles.recommendationKicker}>Recommended version</p>
                <p className={styles.recommendationSummary}>{data.recommendedVersion.summary}</p>
                <Link href="#continue" className={styles.recommendationAction}>
                  <span>{data.bestNextAction.label}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>

              <p className={styles.coverageLine}>
                {data.evidenceCoverage.complete} of {data.evidenceCoverage.total} exhibits complete
                {data.evidenceCoverage.partial > 0
                  ? ` · ${data.evidenceCoverage.partial} partial`
                  : ''}
              </p>
            </section>

            {/* A. Decision drivers */}
            <section id="decision-drivers" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit A</p>
              <h2>Decision drivers</h2>
              <div className={styles.twoColumn}>
                <div>
                  <h3 className={styles.subheading}>
                    <Check aria-hidden="true" /> Encouraging signals
                  </h3>
                  <ul className={styles.plainList}>
                    {s.decisionDrivers.encouraging.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className={styles.subheading}>
                    <Minus aria-hidden="true" /> Reasons for caution
                  </h3>
                  <ul className={styles.plainList}>
                    {s.decisionDrivers.caution.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <blockquote className={styles.calloutRed}>
                <strong>Strongest argument against</strong>
                <p>{s.decisionDrivers.strongestArgumentAgainst}</p>
              </blockquote>
              <p className={styles.mutedNote}>
                Could improve the verdict: {s.decisionDrivers.couldImprove}
              </p>
              <p className={styles.mutedNote}>
                Could weaken the verdict: {s.decisionDrivers.couldWeaken}
              </p>
            </section>

            {/* B. Customer and problem evidence */}
            <section id="customer-evidence" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit B</p>
              <h2>Customer and problem evidence</h2>
              <p>{s.customerEvidence.problem}</p>
              <p className={styles.prose}>
                <strong>Buying trigger.</strong> {s.customerEvidence.buyingTrigger}
              </p>
              <div className={styles.segmentHighlight}>
                <Users aria-hidden="true" />
                <div>
                  <p className={styles.segmentLabel}>Recommended starting segment</p>
                  <p>{s.customerEvidence.recommendedSegment}</p>
                </div>
              </div>
              <p className={styles.subheadingPlain}>Current alternatives</p>
              <div className={styles.chipRow}>
                {s.customerEvidence.alternatives.map((alt) => (
                  <span key={alt} className={styles.chip}>
                    {alt}
                  </span>
                ))}
              </div>
              <p className={styles.mutedNote}>{s.customerEvidence.uncertainties}</p>
            </section>

            {/* C. Competitive landscape */}
            <section id="competitive-landscape" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit C</p>
              <h2>Competitive landscape</h2>
              <ol className={styles.ledger}>
                {s.competitiveLandscape.competitors.map((c) => (
                  <li key={c.name} className={styles.ledgerRow}>
                    <div className={styles.ledgerHead}>
                      <strong>{c.name}</strong>
                      <div className={styles.ledgerFacts}>
                        {c.pricing ? <span>{c.pricing}</span> : null}
                        {c.traction ? <span>{c.traction}</span> : null}
                      </div>
                    </div>
                    <p>{c.description}</p>
                    <div className={styles.ledgerTags}>
                      <span className={styles.ledgerTagGood}>Strength — {c.strength}</span>
                      <span className={styles.ledgerTagGap}>Gap — {c.gap}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* D. Demand and market signals */}
            <section id="demand-signals" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit D</p>
              <h2>Demand and market signals</h2>
              {s.demandSignals.status === 'partial' ? (
                <p className={styles.partialNote}>
                  Partial: some signals are strong, but a reliable market-size figure could not be
                  established.
                </p>
              ) : null}
              <ul className={styles.plainList}>
                {s.demandSignals.signals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
              <p className={styles.prose}>
                <strong>Trend to watch.</strong> {s.demandSignals.trends[0]}
              </p>
              <p className={styles.mutedNote}>{s.demandSignals.limitation}</p>
            </section>

            {/* E. Business model */}
            <section id="business-model" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit E</p>
              <h2>Business model</h2>
              <dl className={styles.factRows}>
                <div>
                  <dt>Buyer</dt>
                  <dd>{s.businessModel.buyer}</dd>
                </div>
                <div>
                  <dt>User</dt>
                  <dd>{s.businessModel.user}</dd>
                </div>
                <div>
                  <dt>Comparable pricing</dt>
                  <dd>{s.businessModel.comparablePricing}</dd>
                </div>
                <div>
                  <dt>Retention characteristics</dt>
                  <dd>{s.businessModel.retentionCharacteristics}</dd>
                </div>
              </dl>
              <p className={styles.prose}>
                <strong>Most plausible model.</strong> {s.businessModel.mostPlausibleModel}
              </p>
            </section>

            {/* F. Feasibility and difficulty */}
            <section id="feasibility" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit F</p>
              <h2>Feasibility and difficulty</h2>
              <p className={styles.mutedNote}>{s.feasibility.playbook} playbook</p>
              <ul className={styles.expandableList}>
                {s.feasibility.rows.map((row) => (
                  <ExpandableRow
                    key={row.dimension}
                    primary={row.dimension}
                    rating={row.rating}
                    detail={row.reasoning}
                  />
                ))}
              </ul>
            </section>

            {/* G. Critical assumptions and risks */}
            <section id="risks" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit G</p>
              <h2>Critical assumptions and risks</h2>
              <ul className={styles.expandableList}>
                {s.risks.items.map((item) => (
                  <RiskRow key={item.title} item={item} />
                ))}
              </ul>
            </section>

            {/* H. Recommended refinement */}
            <section id="refinement" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit H</p>
              <h2>Recommended refinement</h2>
              <div className={styles.compareGrid}>
                <div className={styles.compareCol}>
                  <p className={styles.compareLabel}>{s.refinement.current.label}</p>
                  <p>{s.refinement.current.description}</p>
                </div>
                <div className={`${styles.compareCol} ${styles.compareColRecommended}`}>
                  <p className={styles.compareLabel}>{s.refinement.recommended.label}</p>
                  <p>{s.refinement.recommended.description}</p>
                </div>
              </div>
              <div className={styles.twoColumn}>
                <div>
                  <h3 className={styles.subheading}>What changed</h3>
                  <ul className={styles.plainList}>
                    {data.recommendedVersion.changed.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className={styles.subheading}>What was retained</h3>
                  <ul className={styles.plainList}>
                    {data.recommendedVersion.retained.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* I. What would change the verdict */}
            <section id="verdict-changers" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit I</p>
              <h2>What would change the verdict</h2>
              <div className={styles.twoColumn}>
                <div>
                  <h3 className={styles.subheading}>
                    <Check aria-hidden="true" /> Would improve it
                  </h3>
                  <ul className={styles.plainList}>
                    {s.verdictChangers.wouldImprove.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className={styles.subheading}>
                    <Minus aria-hidden="true" /> Would weaken it
                  </h3>
                  <ul className={styles.plainList}>
                    {s.verdictChangers.wouldWeaken.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className={styles.subheadingPlain}>Open questions</p>
              <ul className={styles.plainList}>
                {s.verdictChangers.openQuestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={styles.subheadingPlain}>Useful real-world actions</p>
              <ul className={styles.plainList}>
                {s.verdictChangers.realWorldActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {/* J. Optional controlled section */}
            <section id="optional-section" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit J</p>
              <h2>{s.optionalSection.title}</h2>
              <p>{s.optionalSection.body}</p>
            </section>

            {/* K. Case references */}
            <section id="sources" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit K</p>
              <h2>Case references</h2>
              <p className={styles.mutedNote}>{s.limitations}</p>
              <CaseReferences />
            </section>

            {/* L. Continue from here */}
            <section id="continue" className={styles.section}>
              <p className={styles.exhibitTag}>Exhibit L</p>
              <h2>Continue from here</h2>
              <div className={styles.actionList}>
                {data.followUpActions.map((action) => (
                  <div
                    key={action.id}
                    className={`${styles.actionCard} ${action.primary ? styles.actionCardPrimary : ''}`}
                  >
                    <div>
                      <strong>{action.label}</strong>
                      <p>{action.description}</p>
                    </div>
                    <button type="button" className={styles.actionButton}>
                      <Coins aria-hidden="true" />
                      <span>{action.credits}</span>
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className={styles.flagIssue}>
                <ShieldCheck aria-hidden="true" />
                <span>Report an issue with this investigation</span>
              </button>
            </section>
          </main>
        </div>
      </div>
    </ProductShell>
  );
}
