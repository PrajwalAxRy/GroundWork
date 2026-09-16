import { ProductShell } from '@/components/product/product-shell';
import { ArrowRight, CheckCircle2, FlaskConical } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Experiments',
  robots: { index: false, follow: false },
};

const experiments = [
  {
    href: '/_experiments/idea-card-6',
    title: 'Idea card: Signal edge',
    description:
      'The approved dashboard card direction shown across active, ready, running, unread, and failed states.',
    area: 'Dashboard',
    status: 'Approved direction',
    approved: true,
  },
  {
    href: '/_experiments/confirm-idea',
    title: 'Confirm idea',
    description:
      'A development prototype for reviewing an Idea Brief, resolving uncertainty, and confirming it for investigation.',
    area: 'Shape review',
    status: 'Prototype',
    approved: false,
  },
] as const;

export default function ExperimentsIndexPage() {
  return (
    <ProductShell>
      <main className="experiment-directory">
        <header className="experiment-directory__header">
          <div>
            <p className="kicker">Development only</p>
            <h1>Experiments</h1>
            <p className="experiment-directory__intro">
              Browse focused interface studies before they are integrated into the product.
            </p>
          </div>
          <Link className="experiment-directory__back" href="/ideas">
            Return to Your ideas
          </Link>
        </header>

        <section
          className="experiment-directory__catalogue"
          aria-labelledby="experiment-list-title"
        >
          <div className="experiment-directory__list-heading">
            <h2 id="experiment-list-title">Available routes</h2>
            <span>{experiments.length} experiments</span>
          </div>

          <ol className="experiment-directory__list">
            {experiments.map((experiment, index) => (
              <li key={experiment.href}>
                <Link href={experiment.href}>
                  <span className="experiment-directory__number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="experiment-directory__copy">
                    <span className="experiment-directory__title">{experiment.title}</span>
                    <span className="experiment-directory__description">
                      {experiment.description}
                    </span>
                  </span>
                  <span className="experiment-directory__meta">
                    <span>{experiment.area}</span>
                    <span className={experiment.approved ? 'is-approved' : undefined}>
                      {experiment.approved ? (
                        <CheckCircle2 aria-hidden="true" />
                      ) : (
                        <FlaskConical aria-hidden="true" />
                      )}
                      {experiment.status}
                    </span>
                  </span>
                  <ArrowRight className="experiment-directory__arrow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </ProductShell>
  );
}
