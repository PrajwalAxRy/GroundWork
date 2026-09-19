'use client';

import { ProductShell } from '@/components/product/product-shell';
import {
  type IdeaVariation,
  type ReportCompetitor,
  investigationReport2,
} from '@/lib/fixtures/investigation-report-2';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  Coins,
  FileText,
  Globe2,
  Lightbulb,
  MapPin,
  ShieldAlert,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import styles from './investigation-report-2-concept.module.css';

const data = investigationReport2;
const ideaVariations = [data.variations.recommended, ...data.variations.alternatives];
const visibleCompetitors = data.competitors.slice(0, 4);

const reportSections = [
  { id: 'conclusion', label: 'Conclusion' },
  { id: 'competition', label: 'Competition' },
  { id: 'customer', label: 'Customer and problem' },
  { id: 'demand', label: 'Demand and business' },
  { id: 'difficulty', label: 'Difficulty and risks' },
  { id: 'refinement', label: 'Recommended version' },
  { id: 'research-notes', label: 'Research notes' },
  { id: 'continue', label: 'Continue from here' },
] as const;

type ReportSectionId = (typeof reportSections)[number]['id'];

function useActiveSection() {
  const [activeSection, setActiveSection] = useState<ReportSectionId>(reportSections[0].id);

  useEffect(() => {
    const elements = reportSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visibleEntry) setActiveSection(visibleEntry.target.id as ReportSectionId);
      },
      { rootMargin: '-18% 0px -68% 0px' },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return activeSection;
}

function ReportNavigation({ activeSection }: { activeSection: string }) {
  return (
    <ol className={styles.navigationList}>
      {reportSections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            aria-current={activeSection === section.id ? 'location' : undefined}
            onClick={(event) => {
              const details = event.currentTarget.closest('details');
              if (details) details.removeAttribute('open');
            }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {section.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

function SectionHeading({
  number,
  title,
  tone = 'blue',
}: {
  number: string;
  title: string;
  tone?: 'blue' | 'coral' | 'mint' | 'violet';
}) {
  return (
    <header className={styles.sectionHeading} data-tone={tone}>
      <span>{number}</span>
      <h2>{title}</h2>
    </header>
  );
}

function VariationStudio({
  selectedVariation,
  onSelect,
  onResearch,
  placement,
}: {
  selectedVariation: IdeaVariation;
  onSelect: (variation: IdeaVariation) => void;
  onResearch: () => void;
  placement: 'hero' | 'footer';
}) {
  return (
    <section className={styles.variationStudio} data-placement={placement}>
      <div className={styles.variationLabel}>
        <Sparkles aria-hidden="true" />
        <span>
          {placement === 'hero' ? 'A stronger variation surfaced' : 'One more path to consider'}
        </span>
      </div>
      <div className={styles.variationMain}>
        <div>
          <h2>{selectedVariation.title}</h2>
          <p>{selectedVariation.rationale}</p>
        </div>
        <button type="button" className={styles.variationAction} onClick={onResearch}>
          <span>Research this idea</span>
          <span className={styles.creditAmount}>
            <Coins aria-hidden="true" /> {data.variations.credits} credits
          </span>
        </button>
      </div>
      <fieldset className={styles.variationChoices}>
        <legend>Ideas surfaced from this research</legend>
        <div>
          {ideaVariations.map((variation) => (
            <button
              type="button"
              key={variation.title}
              aria-pressed={variation.title === selectedVariation.title}
              onClick={() => onSelect(variation)}
            >
              {variation.shortLabel}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
}

function CompetitorCard({ competitor, index }: { competitor: ReportCompetitor; index: number }) {
  const [open, setOpen] = useState(false);
  const disclosureId = useId();
  const triggerId = `${disclosureId}-trigger`;

  return (
    <article className={styles.competitorCard} data-open={open ? 'true' : 'false'}>
      <button
        type="button"
        id={triggerId}
        className={styles.competitorTrigger}
        aria-expanded={open}
        aria-controls={disclosureId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.competitorIndex}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.competitorIdentity}>
          <span>{competitor.kind}</span>
          <strong>{competitor.name}</strong>
          {competitor.location ? (
            <small>
              <MapPin aria-hidden="true" /> {competitor.location}
            </small>
          ) : null}
        </span>
        <span className={styles.competitorSummary}>{competitor.summary}</span>
        <span className={styles.expandCompetitor}>
          {open ? 'Hide details' : 'See details'}
          <ChevronDown aria-hidden="true" />
        </span>
      </button>

      {open ? (
        <section id={disclosureId} className={styles.competitorBody} aria-labelledby={triggerId}>
          <div className={styles.competitorLeadFacts}>
            <div>
              <span>What makes it stand out</span>
              <p>{competitor.usp}</p>
            </div>
            <div>
              <span>Where you may still win</span>
              <p>{competitor.opportunity}</p>
            </div>
          </div>
          <dl className={styles.competitorFacts}>
            <div>
              <dt>Primary customer</dt>
              <dd>{competitor.customer}</dd>
            </div>
            {competitor.pricing ? (
              <div>
                <dt>Pricing</dt>
                <dd>{competitor.pricing}</dd>
              </div>
            ) : null}
            {competitor.revenue ? (
              <div>
                <dt>Revenue</dt>
                <dd>{competitor.revenue}</dd>
              </div>
            ) : null}
            <div>
              <dt>Likely moat</dt>
              <dd>{competitor.moat}</dd>
            </div>
          </dl>
          <a href={`https://${competitor.website}`} target="_blank" rel="noreferrer">
            Visit {competitor.website}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </section>
      ) : null}
    </article>
  );
}

export function InvestigationReport2Concept() {
  const activeSection = useActiveSection();
  const [selectedVariationTitle, setSelectedVariationTitle] = useState(
    data.variations.recommended.title,
  );
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [researchOffer, setResearchOffer] = useState<'variation' | 'competition' | null>(null);
  const activeLabel =
    reportSections.find((section) => section.id === activeSection)?.label ?? 'Conclusion';
  const selectedVariation =
    ideaVariations.find((variation) => variation.title === selectedVariationTitle) ??
    data.variations.recommended;
  const researchCredits =
    researchOffer === 'competition' ? data.competitionResearch.credits : data.variations.credits;

  return (
    <>
      <Dialog.Root open={roadmapOpen} onOpenChange={setRoadmapOpen}>
        <ProductShell credits={10}>
          <div className={styles.page}>
            <a className={styles.skipLink} href="#report-content">
              Skip to report
            </a>
            <header className={styles.utilityBar}>
              <div className={styles.ideaContext}>
                <Link className={styles.backLink} href="/ideas">
                  <ArrowLeft aria-hidden="true" />
                  <span>Your ideas</span>
                </Link>
                <span className={styles.utilityDivider} aria-hidden="true" />
                <span className={styles.ideaName}>
                  <strong>{data.idea.title}</strong>
                  <small>{data.idea.stage}</small>
                </span>
              </div>
              <Link className={styles.transcriptLink} href={data.idea.shapeTranscriptHref}>
                <FileText aria-hidden="true" />
                <span>Read Shape transcript</span>
              </Link>
            </header>

            <div className={styles.reportLayout}>
              <aside className={styles.guideRail}>
                <div className={styles.guideRailInner}>
                  <p>In this report</p>
                  <nav aria-label="Report sections">
                    <ReportNavigation activeSection={activeSection} />
                  </nav>
                  <div className={styles.railMeta}>
                    <span>
                      <MapPin aria-hidden="true" /> {data.research.geography}
                    </span>
                    <span>
                      <CalendarDays aria-hidden="true" /> {data.research.completedOn}
                    </span>
                  </div>
                  <div className={styles.railRoadmap}>
                    <span>Ready for the next step?</span>
                    <button type="button" onClick={() => setRoadmapOpen(true)}>
                      Build my Roadmap
                      <ArrowRight aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </aside>

              <main id="report-content" className={styles.document} tabIndex={-1}>
                <details className={styles.mobileContents}>
                  <summary>
                    <span>
                      <BookOpen aria-hidden="true" /> Contents
                    </span>
                    <span className={styles.currentSection}>{activeLabel}</span>
                    <ChevronDown aria-hidden="true" />
                  </summary>
                  <nav aria-label="Report sections">
                    <ReportNavigation activeSection={activeSection} />
                  </nav>
                </details>

                <section id="conclusion" className={styles.hero} aria-labelledby="report-title">
                  <div className={styles.reportMeta}>
                    <span>Investigation report</span>
                    <span aria-hidden="true">·</span>
                    <span>{data.research.geography}</span>
                    <span aria-hidden="true">·</span>
                    <span>{data.research.completedOn}</span>
                  </div>

                  <h1 id="report-title">{data.conclusion.title}</h1>
                  <p className={styles.heroSummary}>{data.conclusion.summary}</p>

                  <div className={styles.verdictLine}>
                    <span className={styles.verdictMark} aria-hidden="true">
                      <Target />
                    </span>
                    <div>
                      <span>Groundwork&apos;s view</span>
                      <strong>{data.conclusion.verdict}</strong>
                    </div>
                    <span className={styles.confidence}>{data.conclusion.confidence}</span>
                  </div>

                  <VariationStudio
                    selectedVariation={selectedVariation}
                    onSelect={(variation) => setSelectedVariationTitle(variation.title)}
                    onResearch={() => setResearchOffer('variation')}
                    placement="hero"
                  />

                  <div className={styles.oneThing}>
                    <p>If you only read one thing</p>
                    <strong>{data.conclusion.oneThing}</strong>
                  </div>

                  <div className={styles.takeawayRows}>
                    <div>
                      <span className={styles.takeawayIcon} aria-hidden="true">
                        <Check />
                      </span>
                      <div>
                        <p>Why it could work</p>
                        <ul>
                          {data.conclusion.support.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <span className={styles.takeawayIcon} aria-hidden="true">
                        <CircleAlert />
                      </span>
                      <div>
                        <p>What to watch</p>
                        <span>{data.conclusion.concern}</span>
                      </div>
                    </div>
                    <div className={styles.nextStepRow}>
                      <span className={styles.takeawayIcon} aria-hidden="true">
                        <ArrowRight />
                      </span>
                      <div>
                        <p>Best next step</p>
                        <span>{data.conclusion.nextStep}</span>
                      </div>
                    </div>
                  </div>

                  <p className={styles.evidenceNote}>
                    <Lightbulb aria-hidden="true" />
                    <span>{data.conclusion.evidenceNote}</span>
                  </p>

                  <details className={styles.ideaDisclosure}>
                    <summary>
                      <span>The idea we investigated</span>
                      <ChevronDown aria-hidden="true" />
                    </summary>
                    <p>{data.idea.summary}</p>
                  </details>
                </section>

                <section
                  id="competition"
                  className={`${styles.reportSection} ${styles.competitionSection}`}
                >
                  <div className={styles.competitionHeadingRow}>
                    <div>
                      <SectionHeading number="01" title="The competitive picture" tone="violet" />
                      <p className={styles.sectionLead}>
                        Four companies already own pieces of this workflow. None appears to make
                        referral accountability its whole product—which may be the opening worth
                        testing.
                      </p>
                    </div>
                    <div className={styles.competitionCount}>
                      <Building2 aria-hidden="true" />
                      <strong>{visibleCompetitors.length}</strong>
                      <span>closest competitors</span>
                    </div>
                  </div>

                  <div className={styles.competitorStack}>
                    {visibleCompetitors.map((competitor, index) => (
                      <CompetitorCard key={competitor.name} competitor={competitor} index={index} />
                    ))}
                  </div>

                  <aside className={styles.competitionUpsell}>
                    <span className={styles.competitionUpsellIcon} aria-hidden="true">
                      <Globe2 />
                    </span>
                    <div>
                      <p>Dedicated competition research</p>
                      <h3>{data.competitionResearch.title}</h3>
                      <span>{data.competitionResearch.description}</span>
                      <ul>
                        {data.competitionResearch.includes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <button type="button" onClick={() => setResearchOffer('competition')}>
                      <span>Explore hidden competitors</span>
                      <span className={styles.creditAmount}>
                        <Coins aria-hidden="true" /> {data.competitionResearch.credits} credits
                      </span>
                    </button>
                  </aside>
                </section>

                <section id="customer" className={styles.reportSection}>
                  <SectionHeading number="02" title="Customer and problem" tone="mint" />
                  <p className={styles.sectionLead}>{data.customer.lead}</p>

                  <div className={styles.customerFocus}>
                    <p>Recommended starting customer</p>
                    <strong>{data.customer.recommendedSegment}</strong>
                    <dl>
                      <div>
                        <dt>Buyer</dt>
                        <dd>{data.customer.buyer}</dd>
                      </div>
                      <div>
                        <dt>Daily users</dt>
                        <dd>{data.customer.user}</dd>
                      </div>
                      <div>
                        <dt>Moment of urgency</dt>
                        <dd>{data.customer.trigger}</dd>
                      </div>
                    </dl>
                  </div>

                  <h3>Where the handoff breaks today</h3>
                  <ol className={styles.workflow}>
                    {data.customer.workflow.map((step, index) => (
                      <li key={step.title}>
                        <span>{index + 1}</span>
                        <div>
                          <strong>{step.title}</strong>
                          <p>{step.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>

                <section id="demand" className={styles.reportSection}>
                  <SectionHeading number="03" title="Demand and business reality" tone="coral" />
                  <p className={styles.sectionLead}>
                    The need is credible. The commercial question is whether it is painful enough to
                    justify a separate product before a visible failure happens.
                  </p>

                  <div className={styles.signalList}>
                    {data.demandAndBusiness.demandSignals.map((signal) => (
                      <div key={signal.label}>
                        <span>{signal.label}</span>
                        <strong>{signal.value}</strong>
                        <p>{signal.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className={styles.businessSummary}>
                    <h3>A plausible way to sell it</h3>
                    <dl>
                      <div>
                        <dt>Buyer</dt>
                        <dd>{data.demandAndBusiness.model.buyer}</dd>
                      </div>
                      <div>
                        <dt>Model</dt>
                        <dd>{data.demandAndBusiness.model.approach}</dd>
                      </div>
                      <div>
                        <dt>Pricing to test</dt>
                        <dd>{data.demandAndBusiness.model.priceLearning}</dd>
                      </div>
                      <div>
                        <dt>What could create retention</dt>
                        <dd>{data.demandAndBusiness.model.retention}</dd>
                      </div>
                    </dl>
                  </div>
                </section>

                <section id="difficulty" className={styles.reportSection}>
                  <SectionHeading number="04" title="Difficulty and risks" tone="coral" />
                  <p className={styles.sectionLead}>
                    A focused prototype is straightforward. Adoption and integration are the parts
                    that decide whether this becomes a sustainable product.
                  </p>

                  <div className={styles.feasibilityRows}>
                    {data.feasibility.map((item) => (
                      <div key={item.label}>
                        <strong>{item.label}</strong>
                        <span>{item.rating}</span>
                        <p>{item.detail}</p>
                      </div>
                    ))}
                  </div>

                  <h3>Assumptions to test before building</h3>
                  <div className={styles.riskList}>
                    {data.risks.map((risk) => (
                      <details key={risk.title}>
                        <summary>
                          <span>
                            <ShieldAlert aria-hidden="true" />
                            <span>
                              <strong>{risk.title}</strong>
                              <small>{risk.summary}</small>
                            </span>
                          </span>
                          <span className={styles.riskLevel}>{risk.level} impact</span>
                          <ChevronDown aria-hidden="true" />
                        </summary>
                        <div className={styles.riskBody}>
                          <p>{risk.whyItMatters}</p>
                          <div>
                            <Target aria-hidden="true" />
                            <p>
                              <strong>Cheapest useful test</strong>
                              {risk.cheapestTest}
                            </p>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>

                <section id="refinement" className={styles.reportSection}>
                  <SectionHeading number="05" title="The version we would pursue" tone="mint" />
                  <div className={styles.refinementComparison}>
                    <div>
                      <span>Current idea</span>
                      <p>{data.refinement.current}</p>
                    </div>
                    <ArrowRight aria-hidden="true" />
                    <div>
                      <span>Recommended starting point</span>
                      <p>{data.refinement.recommended}</p>
                    </div>
                  </div>

                  <div className={styles.keepChangeGrid}>
                    <div>
                      <h3>What changes</h3>
                      <ul>
                        {data.refinement.changed.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3>What stays</h3>
                      <ul>
                        {data.refinement.retained.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={styles.verdictChangers}>
                    <h3>What would change this recommendation</h3>
                    <div>
                      <div>
                        <p>Make us more confident</p>
                        <ul>
                          {data.verdictChangers.improve.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p>Make us less confident</p>
                        <ul>
                          {data.verdictChangers.weaken.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="research-notes" className={styles.reportSection}>
                  <SectionHeading number="06" title="Research notes" />
                  <p className={styles.sectionLead}>{data.limitations}</p>
                  <p className={styles.unansweredNote}>
                    <CircleAlert aria-hidden="true" />
                    <span>{data.verdictChangers.unanswered}</span>
                  </p>

                  <details className={styles.sourcesDisclosure}>
                    <summary>
                      <span>Sources used in this investigation</span>
                      <ChevronDown aria-hidden="true" />
                    </summary>
                    <ul>
                      {data.sources.map((source) => (
                        <li key={source.title}>
                          <a href={source.url} target="_blank" rel="noreferrer">
                            {source.title}
                          </a>
                          <span>{source.publisher}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </section>

                <VariationStudio
                  selectedVariation={selectedVariation}
                  onSelect={(variation) => setSelectedVariationTitle(variation.title)}
                  onResearch={() => setResearchOffer('variation')}
                  placement="footer"
                />

                <section id="continue" className={styles.continueSection}>
                  <span className={styles.continueIcon} aria-hidden="true">
                    <ArrowRight />
                  </span>
                  <div>
                    <p>Continue from here</p>
                    <h2>Turn the recommendation into a simple plan.</h2>
                    <span>
                      Build a Roadmap for the referral-first version, or begin a new Investigation
                      if you want to change the customer, geography, or product direction.
                    </span>
                    <div className={styles.continueActions}>
                      <button type="button" onClick={() => setRoadmapOpen(true)}>
                        Build my Roadmap
                      </button>
                      <button type="button" onClick={() => setResearchOffer('variation')}>
                        Research the stronger idea · {data.variations.credits} credits
                      </button>
                    </div>
                  </div>
                </section>

                <footer className={styles.reportFooter}>
                  <span>Groundwork research is a decision aid, not proof of market demand.</span>
                  <button type="button">Report an issue</button>
                </footer>
              </main>
            </div>
            <button
              type="button"
              className={styles.mobileRoadmap}
              onClick={() => setRoadmapOpen(true)}
            >
              <span>Build my Roadmap</span>
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </ProductShell>

        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.roadmapDialog}>
            <Dialog.Close asChild>
              <button
                type="button"
                className={styles.dialogClose}
                aria-label="Close Roadmap options"
              >
                <X aria-hidden="true" />
              </button>
            </Dialog.Close>
            <span className={styles.dialogEyebrow}>Before we build your Roadmap</span>
            <Dialog.Title>Which idea should the plan follow?</Dialog.Title>
            <Dialog.Description>
              This Investigation found a narrower version that may be easier to validate. You can
              keep moving with the original idea or research that variation first.
            </Dialog.Description>

            <div className={styles.roadmapChoices}>
              <section>
                <span>Use this report</span>
                <h3>{data.idea.title}</h3>
                <p>Build the Roadmap from the evidence you already purchased.</p>
                <Dialog.Close asChild>
                  <Link href="/credits?for=roadmap&idea=idea-03">
                    Build Roadmap for this idea
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Dialog.Close>
              </section>
              <section className={styles.roadmapVariationChoice}>
                <span>Suggested by the research</span>
                <h3>{data.variations.recommended.title}</h3>
                <p>{data.variations.recommended.rationale}</p>
                <button
                  type="button"
                  onClick={() => {
                    setRoadmapOpen(false);
                    window.setTimeout(() => setResearchOffer('variation'), 120);
                  }}
                >
                  Research this first
                  <span className={styles.creditAmount}>
                    <Coins aria-hidden="true" /> {data.variations.credits} credits
                  </span>
                </button>
              </section>
            </div>
            <p className={styles.dialogNote}>
              No credits are used until you confirm a paid action.
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root
        open={researchOffer !== null}
        onOpenChange={(open) => {
          if (!open) setResearchOffer(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.researchDialog}>
            <Dialog.Close asChild>
              <button
                type="button"
                className={styles.dialogClose}
                aria-label="Close research offer"
              >
                <X aria-hidden="true" />
              </button>
            </Dialog.Close>
            <span className={styles.dialogEyebrow}>Focused follow-up research</span>
            <Dialog.Title>
              {researchOffer === 'competition'
                ? data.competitionResearch.title
                : `Research “${selectedVariation.title}”`}
            </Dialog.Title>
            <Dialog.Description>
              {researchOffer === 'competition'
                ? data.competitionResearch.description
                : selectedVariation.rationale}
            </Dialog.Description>
            {researchOffer === 'competition' ? (
              <ul>
                {data.competitionResearch.includes.map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.researchCreatesNewIdea}>
                This creates a new Idea and keeps the current report unchanged.
              </p>
            )}
            <div className={styles.dialogActions}>
              <Dialog.Close asChild>
                <button type="button">Not now</button>
              </Dialog.Close>
              <button type="button" onClick={() => setResearchOffer(null)}>
                Confirm research
                <span className={styles.creditAmount}>
                  <Coins aria-hidden="true" /> {researchCredits} credits
                </span>
              </button>
            </div>
            <p className={styles.dialogNote}>
              Credits are reserved now and used only if the research completes successfully.
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
