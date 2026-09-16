'use client';

import { ProductShell } from '@/components/product/product-shell';
import { Button } from '@/components/ui/product-primitives';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowLeft,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Lightbulb,
  MessageCircleMore,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';

const starters = [
  {
    label: 'A problem I keep seeing',
    text: 'Small clinics lose track of patient requests across email, calls, and WhatsApp.',
  },
  {
    label: 'A service I could offer',
    text: 'I want to help independent cafés reduce the food they throw away at closing time.',
  },
  {
    label: 'A product I wish existed',
    text: 'I wish renters had one calm place to document repairs and follow up with landlords.',
  },
] as const;

type Message = { id: number; role: 'groundwork' | 'user'; content: string };
type BriefItem = {
  label: string;
  value: string;
  status: 'confirmed' | 'assumption' | 'open';
};

const briefItems: BriefItem[] = [
  {
    label: 'Problem',
    value: 'Patient requests get lost across several channels.',
    status: 'confirmed',
  },
  {
    label: 'Target customer',
    value: 'Independent clinics with a small administrative team.',
    status: 'assumption',
  },
  { label: 'Likely buyer', value: 'Practice manager.', status: 'confirmed' },
  {
    label: 'First version',
    value: 'Collect messages or track follow-ups after staff add them.',
    status: 'open',
  },
];

const sampleMessages: Message[] = [
  {
    id: 1,
    role: 'user',
    content: 'Small clinics lose track of patient requests across email, calls, and WhatsApp.',
  },
  {
    id: 2,
    role: 'groundwork',
    content:
      'The useful part may not be another inbox. It may be giving one person a reliable way to see what still needs a response, regardless of where the request arrived. Who feels this problem most sharply today: the receptionist, the practice manager, or the clinician?',
  },
  {
    id: 3,
    role: 'user',
    content:
      'Probably the practice manager. They end up chasing everyone when something gets missed.',
  },
  {
    id: 4,
    role: 'groundwork',
    content:
      'That points to a clearer buyer and a narrower promise: fewer patient requests falling through the cracks, without replacing the clinic’s existing systems. Would the first version collect requests into one queue, or simply track follow-ups after staff add them?',
  },
];

function StatusIcon({ status }: { status: BriefItem['status'] }) {
  if (status === 'confirmed') return <CheckCircle2 aria-hidden="true" />;
  if (status === 'assumption') return <Sparkles aria-hidden="true" />;
  return <CircleDashed aria-hidden="true" />;
}

function statusLabel(status: BriefItem['status']) {
  if (status === 'confirmed') return 'Confirmed';
  if (status === 'assumption') return 'Groundwork’s assumption';
  return 'Still exploring';
}

export function ShapeExperiment() {
  const [view, setView] = useState<'start' | 'conversation'>('start');
  const [thought, setThought] = useState('');
  const [draft, setDraft] = useState('');
  const [briefOpen, setBriefOpen] = useState(true);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);

  function beginShaping(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const initialThought = thought.trim();
    if (!initialThought) return;
    setMessages([
      { id: 1, role: 'user', content: initialThought },
      {
        id: 2,
        role: 'groundwork',
        content:
          'Let’s make the problem concrete before settling on a solution. Who runs into this most often, and what do they do today when it happens?',
      },
    ]);
    setView('conversation');
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    const nextId = messages.length + 1;
    setMessages((current) => [
      ...current,
      { id: nextId, role: 'user', content },
      {
        id: nextId + 1,
        role: 'groundwork',
        content:
          'That helps narrow the idea. The strongest version should make that improvement obvious without asking people to change everything at once. What is the smallest result they would value enough to try?',
      },
    ]);
    setDraft('');
  }

  function showSampleConversation() {
    setMessages(sampleMessages);
    setView('conversation');
  }

  function resetExperiment() {
    setThought('');
    setDraft('');
    setMessages(sampleMessages);
    setBriefOpen(true);
    setReviewOpen(false);
    setView('start');
  }

  return (
    <ProductShell>
      <main className="shape-saas">
        <nav className="shape-saas__experiment-bar" aria-label="Shape experiment controls">
          <Link href="/_experiments">
            <ArrowLeft aria-hidden="true" />
            Experiments
          </Link>
          <span>Development prototype</span>
          {view === 'conversation' && (
            <button type="button" onClick={resetExperiment}>
              <RotateCcw aria-hidden="true" />
              Start view
            </button>
          )}
        </nav>

        {view === 'start' ? (
          <section className="shape-saas-start" aria-labelledby="shape-start-title">
            <header className="shape-saas-start__header">
              <div className="shape-saas-stage">
                <MessageCircleMore aria-hidden="true" />
                Shape
                <span>Free</span>
              </div>
              <h1 id="shape-start-title">Shape a new idea</h1>
              <p>
                Start with whatever you have. Groundwork will help you clarify the customer,
                problem, and strongest version of the idea.
              </p>
            </header>

            <form className="shape-saas-start__card" onSubmit={beginShaping}>
              <div className="shape-saas-assistant-intro">
                <span aria-hidden="true">
                  <Sparkles />
                </span>
                <div>
                  <strong>What are you thinking about building?</strong>
                  <p>A sentence, a problem you noticed, or a half-formed thought is enough.</p>
                </div>
              </div>
              <label className="sr-only" htmlFor="shape-first-thought">
                Describe your idea
              </label>
              <textarea
                id="shape-first-thought"
                value={thought}
                onChange={(event) => setThought(event.target.value)}
                placeholder="For example: Small clinics lose track of patient requests across email, calls, and WhatsApp."
                rows={5}
                required
              />
              <div className="shape-saas-start__actions">
                <span>Your idea does not need to be polished.</span>
                <Button type="submit" disabled={!thought.trim()}>
                  Start shaping
                  <ArrowUp aria-hidden="true" />
                </Button>
              </div>
            </form>

            <section className="shape-saas-examples" aria-labelledby="shape-examples-title">
              <div className="shape-saas-examples__heading">
                <Lightbulb aria-hidden="true" />
                <h2 id="shape-examples-title">Need a starting point?</h2>
              </div>
              <div className="shape-saas-examples__list">
                {starters.map((starter) => (
                  <button
                    type="button"
                    key={starter.label}
                    onClick={() => setThought(starter.text)}
                  >
                    <strong>{starter.label}</strong>
                    <span>{starter.text}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="shape-saas-start__note">
              <ShieldCheck aria-hidden="true" />
              <p>
                Shape focuses on your thinking and does not search the internet. Groundwork checks
                current competitors, market data, and other live facts during Investigation.
              </p>
              <button type="button" onClick={showSampleConversation}>
                Preview a conversation
              </button>
            </div>
          </section>
        ) : (
          <section className="shape-saas-workspace" aria-labelledby="shape-workspace-title">
            <header className="shape-saas-workspace__header">
              <div>
                <div className="shape-saas-stage">
                  <MessageCircleMore aria-hidden="true" />
                  Shape
                  <span>Saved</span>
                </div>
                <h1 id="shape-workspace-title">A calmer inbox for small clinics</h1>
                <p>Keep talking naturally. You can correct Groundwork at any time.</p>
              </div>
              <Button type="button" variant="outline" onClick={() => setReviewOpen(true)}>
                Review idea
              </Button>
            </header>

            <div className="shape-saas-workspace__layout">
              <section className="shape-saas-chat" aria-label="Shape conversation">
                <div className="shape-saas-chat__messages" aria-live="polite">
                  {messages.map((message) => (
                    <article
                      className={`shape-saas-message shape-saas-message--${message.role}`}
                      key={message.id}
                    >
                      {message.role === 'groundwork' && (
                        <span className="shape-saas-message__avatar" aria-hidden="true">
                          <Sparkles />
                        </span>
                      )}
                      <div>
                        <strong>{message.role === 'groundwork' ? 'Groundwork' : 'You'}</strong>
                        <p>{message.content}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <form className="shape-saas-composer" onSubmit={sendMessage}>
                  <label className="sr-only" htmlFor="shape-reply-input">
                    Continue the conversation
                  </label>
                  <textarea
                    id="shape-reply-input"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Reply, add a detail, or correct an assumption…"
                    rows={3}
                  />
                  <div>
                    <span>Groundwork asks one question at a time.</span>
                    <Button type="submit" aria-label="Send message" disabled={!draft.trim()}>
                      <ArrowUp aria-hidden="true" />
                    </Button>
                  </div>
                </form>
              </section>

              <aside className={`shape-saas-brief ${briefOpen ? 'is-open' : ''}`}>
                <button
                  className="shape-saas-brief__toggle"
                  type="button"
                  aria-expanded={briefOpen}
                  onClick={() => setBriefOpen((open) => !open)}
                >
                  <span>
                    <strong>Idea brief</strong>
                    <small>Updates as the idea becomes clearer</small>
                  </span>
                  <ChevronDown aria-hidden="true" />
                </button>
                {briefOpen && (
                  <div className="shape-saas-brief__content">
                    <p>
                      Help small clinics keep patient requests visible and owned without replacing
                      the tools their staff already use.
                    </p>
                    <div className="shape-saas-brief__fields">
                      {briefItems.map((item) => (
                        <div key={item.label}>
                          <strong>{item.label}</strong>
                          <p>{item.value}</p>
                          <span className={`is-${item.status}`}>
                            <StatusIcon status={item.status} />
                            {statusLabel(item.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => setReviewOpen(true)}>
                      Review full brief
                    </button>
                  </div>
                )}
              </aside>
            </div>
          </section>
        )}
      </main>

      <Dialog.Root open={reviewOpen} onOpenChange={setReviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="shape-review-overlay" />
          <Dialog.Content className="shape-review-dialog">
            <div className="shape-review-dialog__header">
              <div>
                <Dialog.Title>Review your idea</Dialog.Title>
                <Dialog.Description>
                  Check what Groundwork understands before moving toward Investigation.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" aria-label="Close review">
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <div className="shape-review-dialog__summary">
              <span>Idea summary</span>
              <p>
                A shared follow-up workspace that helps small clinics keep patient requests visible
                without replacing their current communication tools.
              </p>
            </div>
            <div className="shape-review-dialog__fields">
              {briefItems.map((item) => (
                <div key={item.label}>
                  <span className={`is-${item.status}`}>
                    <StatusIcon status={item.status} />
                    {statusLabel(item.status)}
                  </span>
                  <strong>{item.label}</strong>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="shape-review-dialog__actions">
              <Dialog.Close asChild>
                <Button type="button" variant="text">
                  Keep shaping
                </Button>
              </Dialog.Close>
              <Button type="button" onClick={() => setReviewOpen(false)}>
                Confirm brief
                <Check aria-hidden="true" />
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ProductShell>
  );
}
