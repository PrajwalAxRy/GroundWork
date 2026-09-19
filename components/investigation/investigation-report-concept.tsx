'use client';

import { ProductShell } from '@/components/product/product-shell';
import { investigationReport } from '@/lib/fixtures/investigation-report';
import * as Dialog from '@radix-ui/react-dialog';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Coins,
  FileText,
  List,
  Minus,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './investigation-report-concept.module.css';

const data = investigationReport;

const sections = [
  { id: 'decision-drivers', label: 'Decision drivers' },
  { id: 'customer-evidence', label: 'Customer and problem evidence' },
  { id: 'competitive-landscape', label: 'Competitive landscape' },
  { id: 'demand-signals', label: 'Demand and market signals' },
  { id: 'business-model', label: 'Business model' },
  { id: 'feasibility', label: 'Feasibility and difficulty' },
  { id: 'risks', label: 'Critical assumptions and risks' },
  { id: 'refinement', label: 'Recommended refinement' },
  { id: 'verdict-changers', label: 'What would change the verdict' },
  { id: 'optional-section', label: data.sections.optionalSection.title },
  { id: 'sources', label: 'Research limitations and sources' },
  { id: 'continue', label: 'Continue from here' },
] as const;

function VerdictIcon({ label }: { label: string }) {
  if (label === 'Worth pursuing') return <CheckCircle2 aria-hidden="true" />;
  if (label === 'Refine before pursuing') return <SlidersHorizontal aria-hidden="true" />;
  if (label === 'Test the critical assumption') return <Target aria-hidden="true" />;
  if (label === 'Major obstacles') return <AlertTriangle aria-hidden="true" />;
  return <X aria-hidden="true" />;
}

function verdictTone(label: string): 'cobalt' | 'amber' | 'rust' {
  if (label === 'Test the critical assumption') return 'amber';
  if (label === 'Major obstacles' || label === 'Reconsider this version') return 'rust';
  return 'cobalt';
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

function SectionEyebrow({ id }: { id: (typeof sections)[number]['id'] }) {
  const index = sections.findIndex((section) => section.id === id);
  return (
    <span className={styles.sectionEyebrow}>
      Section {index + 1} of {sections.length}
    </span>
  );
}

function SectionNavLinks({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <ol className={styles.navList}>
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            aria-current={active === section.id ? 'true' : undefined}
            onClick={onNavigate}
          >
            {section.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

function MobileContents({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className={styles.contentsTrigger}>
          <List aria-hidden="true" />
          <span>Contents</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.sheetOverlay} />
        <Dialog.Content className={styles.sheetContent} aria-describedby={undefined}>
          <div className={styles.sheetHeader}>
            <Dialog.Title>Contents</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close contents">
                <X aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <SectionNavLinks active={active} onNavigate={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ExpandableRow({
  primary,
  secondary,
  detail,
}: { primary: string; secondary?: string; detail: string }) {
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
          {secondary ? <span className={styles.ratingPill}>{secondary}</span> : null}
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
    <li className={styles.riskRow}>
      <button
        type="button"
        className={styles.expandableTrigger}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.expandableMain}>
          <strong>{item.title}</strong>
          <span className={styles.riskTags}>
            <span
              className={styles.ratingPill}
              data-tone={
                item.impact === 'High' ? 'rust' : item.impact === 'Moderate' ? 'amber' : 'neutral'
              }
            >
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

function SourcesAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.sourcesAccordion}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>Sources used in this investigation</span>
        <ChevronDown aria-hidden="true" className={open ? styles.chevronOpen : undefined} />
      </button>
      {open ? (
        <ul>
          {data.sources.map((source) => (
            <li key={source.title}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
              </a>
              <span>
                {source.publisher} · {source.section}
              </span>
            </li>
          ))}
        </ul>
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
      <div className={styles.page} data-tone={tone}>
        <header className={styles.utilityBar}>
          <div className={styles.utilityLeft}>
            <Link className={styles.backLink} href="/ideas" aria-label="Return to Your ideas">
              <ArrowLeft aria-hidden="true" />
              <span>Your ideas</span>
            </Link>
            <span className={styles.divider} aria-hidden="true" />
            <span className={styles.ideaIdentity}>
              <strong>{data.ideaTitle}</strong>
              <small>Investigation</small>
            </span>
          </div>
          <div className={styles.utilityRight}>
            <Link href={data.shapeTranscriptHref} className={styles.transcriptLink}>
              <FileText aria-hidden="true" />
              <span>Read Shape transcript</span>
            </Link>
            <MobileContents active={active} />
          </div>
        </header>

        <div className={styles.layout}>
          <nav className={styles.sideNav} aria-label="Report sections">
            <span className={styles.caseThread} aria-hidden="true">
              <span className={styles.caseThreadFill} style={{ height: `${progress}%` }} />
            </span>
            <span className={styles.sideNavMeta}>
              {data.geography} · Researched {data.researchDate}
            </span>
            <SectionNavLinks active={active} />
          </nav>

          <main className={styles.content}>
            {/* Hero: answer-first decision brief */}
            <section className={styles.hero} aria-labelledby="verdict-heading">
              <p className={styles.heroKicker}>Investigation conclusion</p>
              <div className={styles.verdictRow}>
                <span className={styles.verdictIcon}>
                  <VerdictIcon label={data.verdict} />
                </span>
                <div>
                  <h1 id="verdict-heading">{data.verdict}</h1>
                  <span className={styles.confidence}>{data.confidence}</span>
                </div>
              </div>
              <p className={styles.verdictReasoning}>{data.verdictReasoning}</p>

              <ul className={styles.strongestReasons}>
                {data.strongestReasons.map((reason) => (
                  <li key={reason}>
                    <Check aria-hidden="true" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>

              <p className={styles.strongestConcern}>
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

              <p className={styles.coverageSummary}>
                {data.evidenceCoverage.complete} of {data.evidenceCoverage.total} sections complete
                {data.evidenceCoverage.partial > 0
                  ? ` · ${data.evidenceCoverage.partial} partial`
                  : ''}
              </p>
            </section>

            {/* 1. Decision drivers */}
            <section id="decision-drivers" className={styles.section}>
              <SectionEyebrow id="decision-drivers" />
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
              <blockquote className={styles.calloutRust}>
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

            {/* 2. Customer and problem evidence */}
            <section id="customer-evidence" className={styles.section}>
              <SectionEyebrow id="customer-evidence" />
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

            {/* 3. Competitive landscape */}
            <section id="competitive-landscape" className={styles.section}>
              <SectionEyebrow id="competitive-landscape" />
              <h2>Competitive landscape</h2>
              <div className={styles.competitorGrid}>
                {s.competitiveLandscape.competitors.map((c) => (
                  <button type="button" key={c.name} className={styles.competitorCard}>
                    <span className={styles.competitorIcon}>
                      <Building2 aria-hidden="true" />
                    </span>
                    <strong>{c.name}</strong>
                    <p>{c.description}</p>
                    <div className={styles.competitorFacts}>
                      {c.pricing ? <span>{c.pricing}</span> : null}
                      {c.traction ? <span>{c.traction}</span> : null}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* 4. Demand and market signals */}
            <section id="demand-signals" className={styles.section}>
              <SectionEyebrow id="demand-signals" />
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

            {/* 5. Business model */}
            <section id="business-model" className={styles.section}>
              <SectionEyebrow id="business-model" />
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

            {/* 6. Feasibility and difficulty */}
            <section id="feasibility" className={styles.section}>
              <SectionEyebrow id="feasibility" />
              <h2>Feasibility and difficulty</h2>
              <p className={styles.mutedNote}>{s.feasibility.playbook} playbook</p>
              <ul className={styles.expandableList}>
                {s.feasibility.rows.map((row) => (
                  <ExpandableRow
                    key={row.dimension}
                    primary={row.dimension}
                    secondary={row.rating}
                    detail={row.reasoning}
                  />
                ))}
              </ul>
            </section>

            {/* 7. Critical assumptions and risks */}
            <section id="risks" className={styles.section}>
              <SectionEyebrow id="risks" />
              <h2>Critical assumptions and risks</h2>
              <ul className={styles.expandableList}>
                {s.risks.items.map((item) => (
                  <RiskRow key={item.title} item={item} />
                ))}
              </ul>
            </section>

            {/* 8. Recommended refinement */}
            <section id="refinement" className={styles.section}>
              <SectionEyebrow id="refinement" />
              <h2>Recommended refinement</h2>
              <div className={styles.refinementCompare}>
                <div className={styles.refinementCol}>
                  <p className={styles.refinementLabel}>{s.refinement.current.label}</p>
                  <p>{s.refinement.current.description}</p>
                </div>
                <div className={`${styles.refinementCol} ${styles.refinementColRecommended}`}>
                  <p className={styles.refinementLabel}>{s.refinement.recommended.label}</p>
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

            {/* 9. What would change the verdict */}
            <section id="verdict-changers" className={styles.section}>
              <SectionEyebrow id="verdict-changers" />
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

            {/* 10. Optional controlled section */}
            <section id="optional-section" className={styles.section}>
              <SectionEyebrow id="optional-section" />
              <h2>{s.optionalSection.title}</h2>
              <p>{s.optionalSection.body}</p>
            </section>

            {/* 11. Research limitations and sources */}
            <section id="sources" className={styles.section}>
              <SectionEyebrow id="sources" />
              <h2>Research limitations and sources</h2>
              <p className={styles.mutedNote}>{s.limitations}</p>
              <SourcesAccordion />
            </section>

            {/* 12. Continue from here */}
            <section id="continue" className={styles.section}>
              <SectionEyebrow id="continue" />
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
              <button type="button" className={styles.reportIssueLink}>
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
