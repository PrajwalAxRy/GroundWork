import { ProductShell } from '@/components/product/product-shell';
import { Archive, ArrowRight, CheckCircle2, FlaskConical } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Experiments',
  robots: { index: false, follow: false },
};

const experiments = [
  {
    href: '/_experiments/investigation-progress',
    title: 'Investigation progress concept',
    description:
      'The approved tracking-page direction for genuine research phases, background-safe navigation, and credit outcomes.',
    area: 'Investigation',
    status: 'Approved direction',
    approved: true,
    archived: false,
  },
  {
    href: '/_experiments/shape-conversation_cards',
    title: 'Shape: Idea Brief card iterations',
    description:
      'Ten directions for the Working Summary and collapsible Captured Details, including five from-scratch structures.',
    area: 'Shape components',
    status: 'Comparison study',
    approved: false,
    archived: false,
  },
  {
    href: '/_experiments/shape-conversation',
    title: 'Shape: conversation workspace',
    description:
      'A conversation-first workspace with a persistent composer and compact Idea Brief panel, inspired by familiar chat products.',
    area: 'Shape',
    status: 'Prototype for review',
    approved: false,
    archived: false,
  },
  {
    href: '/_experiments/shape',
    title: 'Shape workspace',
    description:
      'A calm, familiar SaaS workspace with a focused start state, cofounder chat, supporting Idea Brief, and review modal.',
    area: 'Shape',
    status: 'Prototype for review',
    approved: false,
    archived: false,
  },
  {
    href: '/_experiments/shape-states',
    title: 'Shape: response states',
    description:
      'A focused verification route for assistant-response failure, preserved user input, and retry recovery.',
    area: 'Shape states',
    status: 'Verification fixture',
    approved: false,
    archived: false,
  },
  {
    href: '/_experiments/idea-card-6',
    title: 'Idea card: Signal edge',
    description:
      'The approved dashboard card direction shown across active, ready, running, unread, and failed states.',
    area: 'Dashboard',
    status: 'Approved direction',
    approved: true,
    archived: false,
  },
  {
    href: '/_experiments/card-iterations',
    title: 'Idea card iterations',
    description:
      'The restored comparison gallery with twelve early structures, including the six compact studies.',
    area: 'Dashboard archive',
    status: 'Historical study',
    approved: false,
    archived: true,
  },
  {
    href: '/_experiments/confirm-idea',
    title: 'Confirm idea',
    description:
      'A development prototype for reviewing an Idea Brief, resolving uncertainty, and confirming it for investigation.',
    area: 'Shape review',
    status: 'Prototype',
    approved: false,
    archived: false,
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
                      ) : experiment.archived ? (
                        <Archive aria-hidden="true" />
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
