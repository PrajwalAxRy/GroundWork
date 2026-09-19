'use client';

import { ProductShell } from '@/components/product/product-shell';
import { investigationReport2 } from '@/lib/fixtures/investigation-report-2';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  FileText,
  Lightbulb,
  MapPin,
  ShieldAlert,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './investigation-report-2-concept.module.css';

const data = investigationReport2;

const reportSections = [
  { id: 'conclusion', label: 'Conclusion' },
  { id: 'customer', label: 'Customer and problem' },
  { id: 'competition', label: 'Competition' },
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

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <header className={styles.sectionHeading}>
      <span>{number}</span>
      <h2>{title}</h2>
    </header>
  );
}

export function InvestigationReport2Concept() {
  const activeSection = useActiveSection();
  const activeLabel =
    reportSections.find((section) => section.id === activeSection)?.label ?? 'Conclusion';

  return (
    <ProductShell credits={10}>
      <div className={styles.page}>
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
            </div>
          </aside>

          <main className={styles.document}>
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

            <section id="customer" className={styles.reportSection}>
              <SectionHeading number="01" title="Customer and problem" />
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

            <section id="competition" className={styles.reportSection}>
              <SectionHeading number="02" title="How clinics solve this today" />
              <p className={styles.sectionLead}>
                The main competition is not one perfect rival. It is a mix of software the clinic
                already owns and simple workarounds that feel easier than changing behavior.
              </p>

              <div className={styles.alternativeList}>
                {data.alternatives.map((alternative) => (
                  <article key={alternative.name} className={styles.alternativeRow}>
                    <div className={styles.alternativeTitle}>
                      <span>{alternative.kind}</span>
                      <h3>{alternative.name}</h3>
                    </div>
                    <div>
                      <p className={styles.rowLabel}>Why clinics use it</p>
                      <p>{alternative.whyChosen}</p>
                    </div>
                    <div>
                      <p className={styles.rowLabel}>Where there may be room</p>
                      <p>{alternative.opening}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="demand" className={styles.reportSection}>
              <SectionHeading number="03" title="Demand and business reality" />
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
              <SectionHeading number="04" title="Difficulty and risks" />
              <p className={styles.sectionLead}>
                A focused prototype is straightforward. Adoption and integration are the parts that
                decide whether this becomes a sustainable product.
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
              <SectionHeading number="05" title="The version we would pursue" />
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

            <section id="continue" className={styles.continueSection}>
              <span className={styles.continueIcon} aria-hidden="true">
                <ArrowRight />
              </span>
              <div>
                <p>Continue from here</p>
                <h2>Turn the recommendation into a simple plan.</h2>
                <span>
                  Build a Roadmap for the referral-first version, or begin a new Investigation if
                  you want to change the customer, geography, or product direction.
                </span>
                <div className={styles.continueActions}>
                  <button type="button">Build my Roadmap</button>
                  <button type="button">Explore the refined idea</button>
                </div>
              </div>
            </section>

            <footer className={styles.reportFooter}>
              <span>Groundwork research is a decision aid, not proof of market demand.</span>
              <button type="button">Report an issue</button>
            </footer>
          </main>
        </div>
      </div>
    </ProductShell>
  );
}
