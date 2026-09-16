'use client';

import { ProductShell } from '@/components/product/product-shell';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Layers3,
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

type ShapeConversationExperimentProps = {
  mode?: 'experiment' | 'product';
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

export function ShapeConversationExperiment({
  mode = 'experiment',
}: ShapeConversationExperimentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [capturedOpen, setCapturedOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewAccepted, setReviewAccepted] = useState(false);
  const [investigationIntent, setInvestigationIntent] = useState(false);
  const hasConversation = messages.length > 0;
  const isProduct = mode === 'product';

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
    setReviewAccepted(false);
    setInvestigationIntent(false);
  }

  function acceptSummary() {
    setReviewOpen(false);
    setReviewAccepted(true);
    setCapturedOpen(false);
    setInvestigationIntent(false);
  }

  function continueShaping() {
    setReviewAccepted(false);
    setInvestigationIntent(false);
  }

  return (
    <ProductShell>
      <main className={styles.page}>
        <header className={styles.utilityBar}>
          <div className={styles.utilityLeft}>
            <Link href={isProduct ? '/ideas' : '/_experiments'} className={styles.backLink}>
              <ArrowLeft aria-hidden="true" />
              {isProduct ? 'Your ideas' : 'Experiments'}
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
            <span className={styles.saved}>
              {reviewAccepted ? 'Summary accepted' : hasConversation ? 'Saved' : 'Draft'}
            </span>
            {hasConversation ? (
              <button type="button" className={styles.quietButton} onClick={reset}>
                <RotateCcw aria-hidden="true" />
                Start over
              </button>
            ) : !isProduct ? (
              <button type="button" className={styles.quietButton} onClick={showSample}>
                Preview conversation
              </button>
            ) : null}
          </div>
        </header>

        <div className={styles.workspace}>
          <section className={styles.conversation} aria-label="Shape conversation">
            <div className={styles.scroller}>
              {!hasConversation ? (
                <div className={styles.welcome}>
                  <span className={styles.welcomeIcon} aria-hidden="true">
                    <MessageCircleMore />
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

            {reviewAccepted ? (
              <section className={styles.composerArea} aria-labelledby="investigation-ready-title">
                <div className={styles.investigationHandoff}>
                  <div className={styles.handoffHeading}>
                    <span className={styles.handoffIcon} aria-hidden="true">
                      <Check />
                    </span>
                    <div>
                      <p>Shape paused for review</p>
                      <h2 id="investigation-ready-title">Ready to investigate</h2>
                    </div>
                  </div>
                  <p className={styles.handoffCopy}>
                    Groundwork will use this accepted summary as the starting point for live
                    research.
                  </p>
                  <p className={styles.handoffSummary}>
                    Help small clinics keep patient requests visible and owned without replacing the
                    tools their staff already use.
                  </p>
                  <div className={styles.handoffActions}>
                    <button
                      type="button"
                      className={styles.continueButton}
                      onClick={continueShaping}
                    >
                      Continue shaping
                    </button>
                    <button
                      type="button"
                      className={styles.startInvestigationButton}
                      onClick={() => setInvestigationIntent(true)}
                    >
                      Start investigation
                      <ArrowRight aria-hidden="true" />
                    </button>
                  </div>
                  {investigationIntent && (
                    <output className={styles.handoffNotice} aria-live="polite">
                      Next, you&apos;ll review the research scope, credit cost, and failure
                      protection before anything starts.
                    </output>
                  )}
                </div>
              </section>
            ) : (
              <form className={styles.composerArea} onSubmit={sendMessage}>
                <div className={styles.composer}>
                  <label htmlFor="shape-conversation-input" className="sr-only">
                    {hasConversation
                      ? 'Continue discussing your idea'
                      : 'Start discussing your idea'}
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
            )}
          </section>

          <aside className={styles.briefStack} aria-label="Idea brief">
            <section
              className={`${styles.briefCard} ${styles.summaryCard} ${
                reviewAccepted ? styles.readOnlyCard : ''
              }`}
            >
              <header className={styles.summaryTopline}>
                <span className={styles.briefIcon} aria-hidden="true">
                  <Layers3 />
                </span>
                <strong>Working summary</strong>
              </header>
              <div className={styles.summaryBody}>
                {hasConversation ? (
                  <p>
                    Help small clinics keep patient requests visible and owned without replacing the
                    tools their staff already use.
                  </p>
                ) : (
                  <div className={styles.emptySummary}>
                    <p>Continue chatting to update this summary.</p>
                  </div>
                )}
              </div>
            </section>

            <section
              className={`${styles.briefCard} ${styles.detailsCard} ${
                capturedOpen ? styles.cardOpen : ''
              } ${reviewAccepted ? styles.readOnlyCard : ''}`}
            >
              <button
                type="button"
                className={styles.briefHeader}
                onClick={() => setCapturedOpen((open) => !open)}
                aria-expanded={capturedOpen}
              >
                <span className={styles.briefHeading}>
                  <span className={styles.briefIcon} aria-hidden="true">
                    <ListChecks />
                  </span>
                  <strong>Captured details</strong>
                </span>
                <ChevronDown aria-hidden="true" className={styles.chevron} />
              </button>

              {capturedOpen && (
                <div className={styles.briefBody}>
                  {hasConversation ? (
                    <div className={styles.briefFields}>
                      {briefItems.map((item) => (
                        <section key={item.label}>
                          <strong>{item.label}</strong>
                          <p>{item.value}</p>
                        </section>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.emptyCaptured}>Continue chatting to capture details.</p>
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
              <button type="button" className={styles.confirmButton} onClick={acceptSummary}>
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
