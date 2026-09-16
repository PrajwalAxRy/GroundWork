'use client';

import { ProductShell } from '@/components/product/product-shell';
import { Button } from '@/components/ui/product-primitives';
import {
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  CircleDashed,
  Lightbulb,
  MessageCircleMore,
  RotateCcw,
  Sparkles,
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

type Message = {
  id: number;
  role: 'groundwork' | 'user';
  content: string;
};

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

export function ShapeExperiment() {
  const [view, setView] = useState<'start' | 'conversation'>('start');
  const [thought, setThought] = useState('');
  const [draft, setDraft] = useState('');
  const [outlineOpen, setOutlineOpen] = useState(true);
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
          'There is a useful starting point here. Let’s make the problem concrete before we settle on a solution. Who runs into this most often, and what do they do today when it happens?',
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
    setOutlineOpen(true);
    setView('start');
  }

  return (
    <ProductShell>
      <main className={`shape-experiment shape-experiment--${view}`}>
        <nav className="shape-experiment__utility" aria-label="Shape experiment controls">
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
          <section className="shape-start" aria-labelledby="shape-start-title">
            <div className="shape-start__heading">
              <span className="shape-stage-mark">
                <Sparkles aria-hidden="true" />
                Shape
              </span>
              <h1 id="shape-start-title">Bring the rough version.</h1>
              <p>
                Share the thought as it is. Groundwork will help you find the customer, sharpen the
                problem, and challenge what still feels uncertain.
              </p>
            </div>

            <form className="shape-start__composer" onSubmit={beginShaping}>
              <label htmlFor="shape-first-thought">What are you thinking about building?</label>
              <textarea
                id="shape-first-thought"
                value={thought}
                onChange={(event) => setThought(event.target.value)}
                placeholder="A sentence, a problem you noticed, or a half-formed idea is enough…"
                rows={5}
                required
              />
              <div className="shape-start__composer-footer">
                <span>No pitch deck needed.</span>
                <Button type="submit" disabled={!thought.trim()}>
                  Start shaping
                  <ArrowUp aria-hidden="true" />
                </Button>
              </div>
            </form>

            <div className="shape-starters" aria-labelledby="shape-starters-title">
              <div>
                <Lightbulb aria-hidden="true" />
                <p id="shape-starters-title">Not sure how to begin?</p>
              </div>
              <div className="shape-starters__options">
                {starters.map((starter) => (
                  <button
                    type="button"
                    key={starter.label}
                    onClick={() => setThought(starter.text)}
                  >
                    <span>{starter.label}</span>
                    <small>{starter.text}</small>
                  </button>
                ))}
              </div>
            </div>

            <footer className="shape-start__footer">
              <p>
                Shape does not search the internet. Current competitors, market data, and other live
                facts are checked later during Investigation.
              </p>
              <button type="button" onClick={showSampleConversation}>
                Preview a developed conversation
              </button>
            </footer>
          </section>
        ) : (
          <section className="shape-workspace" aria-labelledby="shape-workspace-title">
            <header className="shape-workspace__header">
              <div>
                <span className="shape-stage-mark">
                  <MessageCircleMore aria-hidden="true" />
                  Shape
                </span>
                <h1 id="shape-workspace-title">A calmer inbox for small clinics</h1>
                <p>Draft idea · Changes are kept while you shape</p>
              </div>
              <Button type="button" variant="outline">
                Review idea
              </Button>
            </header>

            <section className={`shape-outline ${outlineOpen ? 'is-open' : ''}`}>
              <button
                className="shape-outline__toggle"
                type="button"
                aria-expanded={outlineOpen}
                onClick={() => setOutlineOpen((open) => !open)}
              >
                <span className="shape-outline__signal" aria-hidden="true" />
                <span>
                  <strong>Idea outline</strong>
                  <small>3 things understood · 4 still open</small>
                </span>
                <ChevronDown aria-hidden="true" />
              </button>
              {outlineOpen && (
                <div className="shape-outline__content">
                  <p className="shape-outline__summary">
                    Help small clinics keep patient requests visible and owned without replacing the
                    tools their staff already use.
                  </p>
                  <dl>
                    <div>
                      <dt>
                        <Check aria-hidden="true" /> Problem
                      </dt>
                      <dd>Patient requests get lost across several channels.</dd>
                    </div>
                    <div>
                      <dt>
                        <Check aria-hidden="true" /> Likely buyer
                      </dt>
                      <dd>Practice manager at an independent clinic.</dd>
                    </div>
                    <div className="is-open-question">
                      <dt>
                        <CircleDashed aria-hidden="true" /> Still exploring
                      </dt>
                      <dd>Whether the first version collects messages or tracks follow-ups.</dd>
                    </div>
                  </dl>
                </div>
              )}
            </section>

            <div className="shape-thread" aria-live="polite">
              {messages.map((message) => (
                <article
                  className={`shape-message shape-message--${message.role}`}
                  key={message.id}
                >
                  <div className="shape-message__speaker" aria-hidden="true">
                    {message.role === 'groundwork' ? <Sparkles /> : <span>You</span>}
                  </div>
                  <div>
                    <strong>{message.role === 'groundwork' ? 'Groundwork' : 'You'}</strong>
                    <p>{message.content}</p>
                  </div>
                </article>
              ))}
            </div>

            <form className="shape-reply" onSubmit={sendMessage}>
              <label htmlFor="shape-reply-input">Continue the conversation</label>
              <div>
                <textarea
                  id="shape-reply-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Add a detail, correct an assumption, or ask a question…"
                  rows={3}
                />
                <Button type="submit" aria-label="Send message" disabled={!draft.trim()}>
                  <ArrowUp aria-hidden="true" />
                </Button>
              </div>
              <p>Groundwork asks one useful question at a time.</p>
            </form>
          </section>
        )}
      </main>
    </ProductShell>
  );
}
