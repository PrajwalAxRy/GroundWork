'use client';

import { ProductShell } from '@/components/product/product-shell';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowLeft,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  FileText,
  Lightbulb,
  ListChecks,
  LockKeyhole,
  MessageCircleMore,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';
import styles from './shape-conversation-experiment.module.css';

type Message = {
  id: number;
  role: 'groundwork' | 'user';
  content: string;
};

type BriefItem = {
  label: string;
  value: string;
  status: 'confirmed' | 'assumption' | 'open';
};

const starters = [
  'A problem I keep seeing',
  'A service I could offer',
  'A product I wish existed',
] as const;

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
      'The useful part may not be another inbox. It may be giving one person a reliable way to see what still needs a response, regardless of where the request arrived. Who feels this problem most sharply today?',
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

const briefItems: BriefItem[] = [
  {
    label: 'Problem',
    value: 'Patient requests get lost across several channels.',
    status: 'confirmed',
  },
  {
    label: 'Customer',
    value: 'Independent clinics with a small administrative team.',
    status: 'assumption',
  },
  {
    label: 'Likely buyer',
    value: 'Practice manager.',
    status: 'confirmed',
  },
  {
    label: 'First version',
    value: 'How requests enter the shared queue still needs discussion.',
    status: 'open',
  },
];

function statusLabel(status: BriefItem['status']) {
  if (status === 'confirmed') return 'Confirmed';
  if (status === 'assumption') return 'Suggested';
  return 'Still exploring';
}

function StatusIcon({ status }: { status: BriefItem['status'] }) {
  if (status === 'confirmed') return <CheckCircle2 aria-hidden="true" />;
  if (status === 'assumption') return <Sparkles aria-hidden="true" />;
  return <CircleDashed aria-hidden="true" />;
}

export function ShapeConversationExperiment() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [capturedOpen, setCapturedOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const hasConversation = messages.length > 0;

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
          current.length === 0
            ? 'Let’s make the problem concrete before settling on a solution. Who runs into this most often, and what do they do today when it happens?'
            : 'That helps narrow the idea. What is the smallest result they would value enough to try?',
      },
    ]);
    setDraft('');
  }

  function useStarter(starter: (typeof starters)[number]) {
    const examples = {
      'A problem I keep seeing':
        'Small clinics lose track of patient requests across email, calls, and WhatsApp.',
      'A service I could offer':
        'I want to help independent cafés reduce the food they throw away at closing time.',
      'A product I wish existed':
        'I wish renters had one calm place to document repairs and follow up with landlords.',
    };
    setDraft(examples[starter]);
  }

  function showSample() {
    setMessages(sampleMessages);
    setDraft('');
  }

  function reset() {
    setMessages([]);
    setDraft('');
    setCapturedOpen(false);
  }

  return (
    <ProductShell>
      <main className={styles.page}>
        <header className={styles.utilityBar}>
          <div className={styles.utilityLeft}>
            <Link href="/_experiments" className={styles.backLink}>
              <ArrowLeft aria-hidden="true" />
              Experiments
            </Link>
            <span className={styles.divider} aria-hidden="true" />
            <div className={styles.ideaIdentity}>
              <span className={styles.ideaIcon} aria-hidden="true">
                <MessageCircleMore />
              </span>
              <span>
                <strong>{hasConversation ? 'A calmer inbox for small clinics' : 'New idea'}</strong>
                <small>Shape</small>
              </span>
            </div>
          </div>
          <div className={styles.utilityActions}>
            <span className={styles.saved}>{hasConversation ? 'Saved' : 'Draft'}</span>
            {hasConversation ? (
              <button type="button" className={styles.quietButton} onClick={reset}>
                <RotateCcw aria-hidden="true" />
                Start over
              </button>
            ) : (
              <button type="button" className={styles.quietButton} onClick={showSample}>
                Preview conversation
              </button>
            )}
          </div>
        </header>

        <div className={styles.workspace}>
          <section className={styles.conversation} aria-label="Shape conversation">
            <div className={styles.scroller}>
              {!hasConversation ? (
                <div className={styles.welcome}>
                  <span className={styles.welcomeIcon} aria-hidden="true">
                    <Sparkles />
                  </span>
                  <h1>Start discussing your idea</h1>
                  <p>
                    Bring a rough thought, a problem you noticed, or something you wish existed.
                    We’ll shape it together, one question at a time.
                  </p>
                  <div className={styles.starters} aria-label="Conversation starters">
                    {starters.map((starter) => (
                      <button key={starter} type="button" onClick={() => useStarter(starter)}>
                        <Lightbulb aria-hidden="true" />
                        {starter}
                      </button>
                    ))}
                  </div>
                  <p className={styles.privateNote}>
                    <LockKeyhole aria-hidden="true" />
                    Shape works from this conversation and does not search the internet.
                  </p>
                </div>
              ) : (
                <div className={styles.messages} aria-live="polite">
                  <div className={styles.dateMarker}>Today</div>
                  {messages.map((message) => (
                    <article
                      className={`${styles.message} ${
                        message.role === 'user' ? styles.userMessage : styles.assistantMessage
                      }`}
                      key={message.id}
                    >
                      {message.role === 'groundwork' && (
                        <span className={styles.avatar} aria-hidden="true">
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
              )}
            </div>

            <form className={styles.composerArea} onSubmit={sendMessage}>
              <div className={styles.composer}>
                <label htmlFor="shape-conversation-input" className="sr-only">
                  {hasConversation ? 'Continue discussing your idea' : 'Start discussing your idea'}
                </label>
                <textarea
                  id="shape-conversation-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={
                    hasConversation
                      ? 'Reply, add a detail, or correct an assumption…'
                      : 'Describe the idea you want to explore…'
                  }
                  rows={3}
                />
                <div className={styles.composerFooter}>
                  <span>
                    {hasConversation
                      ? 'Groundwork asks one main question at a time.'
                      : 'A sentence is enough to begin.'}
                  </span>
                  <div className={styles.composerActions}>
                    <button
                      type="button"
                      className={styles.reviewButton}
                      onClick={() => setReviewOpen(true)}
                      disabled={!hasConversation}
                    >
                      Review idea
                    </button>
                    <button
                      type="submit"
                      className={styles.sendButton}
                      aria-label="Send message"
                      disabled={!draft.trim()}
                    >
                      <ArrowUp aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </section>

          <aside className={styles.briefStack} aria-label="Idea brief">
            <section className={styles.briefCard}>
              <header className={styles.cardHeader}>
                <span className={styles.briefHeading}>
                  <FileText aria-hidden="true" />
                  <span>
                    <strong>Working summary</strong>
                    <small>Updates as you talk</small>
                  </span>
                </span>
              </header>
              <div className={styles.summaryBody}>
                {hasConversation ? (
                  <p>
                    Help small clinics keep patient requests visible and owned without replacing the
                    tools their staff already use.
                  </p>
                ) : (
                  <div className={styles.emptySummary}>
                    <strong>Your idea will take shape here</strong>
                    <p>
                      Start the conversation and Groundwork will summarize the idea as it develops.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className={`${styles.briefCard} ${capturedOpen ? styles.cardOpen : ''}`}>
              <button
                type="button"
                className={styles.briefHeader}
                onClick={() => setCapturedOpen((open) => !open)}
                aria-expanded={capturedOpen}
              >
                <span className={styles.briefHeading}>
                  <ListChecks aria-hidden="true" />
                  <span>
                    <strong>Captured details</strong>
                    <small>{hasConversation ? '4 details captured' : 'Nothing captured yet'}</small>
                  </span>
                </span>
                <ChevronDown aria-hidden="true" className={styles.chevron} />
              </button>

              {capturedOpen && (
                <div className={styles.briefBody}>
                  {hasConversation ? (
                    <div className={styles.briefFields}>
                      {briefItems.map((item) => (
                        <section key={item.label}>
                          <div className={styles.fieldHeading}>
                            <strong>{item.label}</strong>
                            <span className={styles[item.status]}>
                              <StatusIcon status={item.status} />
                              {statusLabel(item.status)}
                            </span>
                          </div>
                          <p>{item.value}</p>
                        </section>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.emptyCaptured}>
                      Confirmed details, suggestions, and open questions will appear here.
                    </p>
                  )}
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>

      <Dialog.Root open={reviewOpen} onOpenChange={setReviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.dialog}>
            <div className={styles.dialogHeader}>
              <div>
                <Dialog.Title>Review your idea</Dialog.Title>
                <Dialog.Description>
                  Check what Groundwork understands before you move on.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" aria-label="Close review">
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <div className={styles.dialogSummary}>
              <span>Idea summary</span>
              <p>
                A shared follow-up workspace that helps small clinics keep patient requests visible
                without replacing their current communication tools.
              </p>
            </div>
            <div className={styles.dialogActions}>
              <Dialog.Close asChild>
                <button type="button" className={styles.keepShaping}>
                  Keep shaping
                </button>
              </Dialog.Close>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={() => setReviewOpen(false)}
              >
                Looks right
                <Check aria-hidden="true" />
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ProductShell>
  );
}
