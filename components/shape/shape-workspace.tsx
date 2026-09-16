'use client';

import { ProductShell } from '@/components/product/product-shell';
import { PROTOTYPE_INVESTIGATION_CREDITS } from '@/lib/config/prototype-commercial';
import type { ProductJob, ShapeSession } from '@/lib/contracts/product';
import * as Dialog from '@radix-ui/react-dialog';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Coins,
  Layers3,
  Lightbulb,
  ListChecks,
  LockKeyhole,
  MessageCircleMore,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';
import styles from './shape-conversation-experiment.module.css';

const starters = [
  'A problem I keep seeing',
  'A service I could offer',
  'A product I wish existed',
] as const;

const starterExamples: Record<(typeof starters)[number], string> = {
  'A problem I keep seeing':
    'Small clinics lose track of patient requests across email, calls, and WhatsApp.',
  'A service I could offer':
    'I want to help independent cafés reduce the food they throw away at closing time.',
  'A product I wish existed':
    'I wish renters had one calm place to document repairs and follow up with landlords.',
};

const investigationOverview = [
  {
    title: 'Customer and demand',
    detail: 'Who has the problem, and evidence that it matters.',
  },
  {
    title: 'Competition analysis',
    detail: 'Existing alternatives, competitors, and gaps in the market.',
  },
  {
    title: 'Business reality',
    detail: 'How it could work, what it takes, and the main risks.',
  },
  {
    title: 'Evidence check',
    detail: 'Claims and sources checked before the report is assembled.',
  },
] as const;

type ShapeWorkspaceProps = {
  mode?: 'experiment' | 'product';
  ideaTitle: string;
  session: ShapeSession | null;
  investigationJob?: ProductJob | null;
  draft: string;
  credits: number;
  saveStatus: string;
  pendingAction?: 'sending' | 'retrying' | 'accepting' | 'resuming' | 'starting' | null;
  actionError?: string | null;
  onDraftChange: (draft: string) => void;
  onDraftBlur?: () => void;
  onSend: () => Promise<void>;
  onRetryResponse?: () => Promise<void>;
  onAcceptSummary?: () => Promise<boolean>;
  onResumeShape?: () => Promise<void>;
  onStartInvestigation?: () => Promise<boolean>;
  onStartOver?: () => void;
  onPreviewConversation?: () => void;
};

function getWorkingSummary(session: ShapeSession | null) {
  return session?.summary.find((field) => field.label === 'Idea')?.value ?? null;
}

export function ShapeWorkspace({
  mode = 'product',
  ideaTitle,
  session,
  investigationJob,
  draft,
  credits,
  saveStatus,
  pendingAction = null,
  actionError,
  onDraftChange,
  onDraftBlur,
  onSend,
  onRetryResponse,
  onAcceptSummary,
  onResumeShape,
  onStartInvestigation,
  onStartOver,
  onPreviewConversation,
}: ShapeWorkspaceProps) {
  const [capturedOpen, setCapturedOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [investigationOpen, setInvestigationOpen] = useState(false);
  const hasConversation = Boolean(session?.messages.length);
  const isProduct = mode === 'product';
  const lifecycle = session?.lifecycle ?? 'shaping';
  const isReadOnly = lifecycle !== 'shaping';
  const workingSummary = getWorkingSummary(session);
  const acceptedSummary = session?.acceptedSummary ?? workingSummary;
  const capturedDetails = session?.summary.filter((field) => field.label !== 'Idea') ?? [];
  const hasFailedResponse = Boolean(session?.messages.some((message) => message.failed));
  const isBusy = pendingAction !== null;

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || isBusy) return;
    await onSend();
  }

  async function acceptSummary() {
    if (!onAcceptSummary || isBusy) return;
    if (await onAcceptSummary()) {
      setReviewOpen(false);
      setCapturedOpen(false);
    }
  }

  async function startInvestigation() {
    if (!onStartInvestigation || isBusy) return;
    if (await onStartInvestigation()) setInvestigationOpen(false);
  }

  return (
    <ProductShell credits={credits}>
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
                <strong>{ideaTitle}</strong>
                <small>Shape</small>
              </span>
            </div>
          </div>
          <div className={styles.utilityActions}>
            <span className={styles.saved}>{saveStatus}</span>
            {onStartOver && hasConversation ? (
              <button type="button" className={styles.quietButton} onClick={onStartOver}>
                <RotateCcw aria-hidden="true" />
                Start over
              </button>
            ) : onPreviewConversation && !hasConversation ? (
              <button type="button" className={styles.quietButton} onClick={onPreviewConversation}>
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
                      <button
                        key={starter}
                        type="button"
                        onClick={() => onDraftChange(starterExamples[starter])}
                      >
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
                  {session?.messages.map((message) => (
                    <article
                      className={`${styles.message} ${
                        message.role === 'user' ? styles.userMessage : styles.assistantMessage
                      } ${message.failed ? styles.failedMessage : ''}`}
                      key={message.id}
                    >
                      {message.role === 'assistant' && (
                        <span className={styles.avatar} aria-hidden="true">
                          {message.failed ? <AlertCircle /> : <Sparkles />}
                        </span>
                      )}
                      <div>
                        <strong>{message.role === 'assistant' ? 'Groundwork' : 'You'}</strong>
                        <p>{message.body}</p>
                        {message.note ? (
                          <span className={styles.researchNote}>
                            <Search aria-hidden="true" />
                            {message.note}
                          </span>
                        ) : null}
                        {message.failed && onRetryResponse ? (
                          <button
                            type="button"
                            className={styles.retryButton}
                            onClick={() => void onRetryResponse()}
                            disabled={isBusy}
                          >
                            <RotateCcw aria-hidden="true" />
                            {pendingAction === 'retrying' ? 'Retrying…' : 'Retry response'}
                          </button>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {actionError ? (
              <div className={styles.inlineError} role="alert">
                <AlertCircle aria-hidden="true" />
                <span>{actionError}</span>
              </div>
            ) : null}

            {lifecycle === 'frozen' ? (
              <section className={styles.composerArea} aria-labelledby="investigation-ready-title">
                <div className={styles.investigationStarted}>
                  <span className={styles.handoffIcon} aria-hidden="true">
                    <Search />
                  </span>
                  <div>
                    <p>{investigationJob ? 'Investigation confirmed' : 'Shape complete'}</p>
                    <h2 id="investigation-ready-title">
                      {investigationJob
                        ? 'Research is about to begin'
                        : 'This transcript is read-only'}
                    </h2>
                    <span>
                      {investigationJob
                        ? `${investigationJob.reservedCredits} credits are reserved. This Idea is now read-only while Groundwork researches it.`
                        : 'Investigation has begun, so the accepted Idea and conversation can no longer be edited.'}
                    </span>
                  </div>
                </div>
              </section>
            ) : lifecycle === 'review_paused' ? (
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
                  <p className={styles.handoffSummary}>{acceptedSummary}</p>
                  <div className={styles.handoffActions}>
                    <button
                      type="button"
                      className={styles.continueButton}
                      onClick={() => void onResumeShape?.()}
                      disabled={isBusy}
                    >
                      {pendingAction === 'resuming' ? 'Resuming…' : 'Continue shaping'}
                    </button>
                    <button
                      type="button"
                      className={styles.startInvestigationButton}
                      onClick={() => setInvestigationOpen(true)}
                      disabled={isBusy}
                    >
                      Start investigation
                      <ArrowRight aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </section>
            ) : (
              <form className={styles.composerArea} onSubmit={submitMessage}>
                <div className={styles.composer}>
                  <label htmlFor="shape-conversation-input" className="sr-only">
                    {hasConversation
                      ? 'Continue discussing your idea'
                      : 'Start discussing your idea'}
                  </label>
                  <textarea
                    id="shape-conversation-input"
                    value={draft}
                    onChange={(event) => onDraftChange(event.target.value)}
                    onBlur={onDraftBlur}
                    placeholder={
                      hasConversation
                        ? 'Reply, add a detail, or correct an assumption…'
                        : 'Describe the idea you want to explore…'
                    }
                    rows={3}
                    disabled={isBusy}
                  />
                  <div className={styles.composerFooter}>
                    <span>
                      {pendingAction === 'sending'
                        ? 'Groundwork is responding…'
                        : hasConversation
                          ? 'Groundwork asks one main question at a time.'
                          : 'A sentence is enough to begin.'}
                    </span>
                    <div className={styles.composerActions}>
                      <button
                        type="button"
                        className={styles.reviewButton}
                        onClick={() => setReviewOpen(true)}
                        disabled={
                          !hasConversation || hasFailedResponse || isBusy || !onAcceptSummary
                        }
                      >
                        Review idea
                      </button>
                      <button
                        type="submit"
                        className={styles.sendButton}
                        aria-label="Send message"
                        disabled={!draft.trim() || isBusy}
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
                isReadOnly ? styles.readOnlyCard : ''
              }`}
            >
              <header className={styles.summaryTopline}>
                <span className={styles.briefIcon} aria-hidden="true">
                  <Layers3 />
                </span>
                <strong>Working summary</strong>
              </header>
              <div className={styles.summaryBody}>
                {workingSummary ? (
                  <p>{workingSummary}</p>
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
              } ${isReadOnly ? styles.readOnlyCard : ''}`}
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

              {capturedOpen ? (
                <div className={styles.briefBody}>
                  {capturedDetails.length ? (
                    <div className={styles.briefFields}>
                      {capturedDetails.map((item) => (
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
              ) : null}
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
                <button type="button" aria-label="Close review" disabled={isBusy}>
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <div className={styles.dialogSummary}>
              <span>Idea summary</span>
              <p>{workingSummary}</p>
            </div>
            {actionError ? (
              <p className={styles.dialogError} role="alert">
                <AlertCircle aria-hidden="true" />
                {actionError}
              </p>
            ) : null}
            <div className={styles.dialogActions}>
              <Dialog.Close asChild>
                <button type="button" className={styles.keepShaping} disabled={isBusy}>
                  Keep shaping
                </button>
              </Dialog.Close>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={() => void acceptSummary()}
                disabled={isBusy}
              >
                {pendingAction === 'accepting' ? 'Saving…' : 'Looks right'}
                <Check aria-hidden="true" />
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={investigationOpen} onOpenChange={setInvestigationOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={`${styles.dialog} ${styles.investigationDialog}`}>
            <div className={styles.dialogHeader}>
              <div>
                <Dialog.Title>Confirm investigation</Dialog.Title>
                <Dialog.Description>
                  Groundwork will use live research to stress-test this idea.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close investigation confirmation"
                  disabled={isBusy}
                >
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <section className={styles.researchOverview} aria-labelledby="research-overview-title">
              <div className={styles.researchOverviewHeading}>
                <span aria-hidden="true">
                  <Search />
                </span>
                <h3 id="research-overview-title">Your investigation will cover</h3>
              </div>
              <dl className={styles.researchTopics}>
                {investigationOverview.map((topic) => (
                  <div key={topic.title}>
                    <dt>{topic.title}</dt>
                    <dd>{topic.detail}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <p className={styles.failureProtection}>
              <ShieldCheck aria-hidden="true" />
              Your credits are reserved when research starts and used only after it completes. They
              are released if the investigation fails.
            </p>

            {actionError ? (
              <p className={styles.dialogError} role="alert">
                <AlertCircle aria-hidden="true" />
                {actionError}
              </p>
            ) : null}

            <div className={styles.dialogActions}>
              <Dialog.Close asChild>
                <button type="button" className={styles.keepShaping} disabled={isBusy}>
                  Not now
                </button>
              </Dialog.Close>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={() => void startInvestigation()}
                aria-label={`Start investigation for ${PROTOTYPE_INVESTIGATION_CREDITS} credits`}
                disabled={isBusy}
              >
                {pendingAction === 'starting' ? 'Starting…' : 'Start investigation'}
                <span className={styles.confirmCost} aria-hidden="true">
                  <Coins />
                  {PROTOTYPE_INVESTIGATION_CREDITS}
                </span>
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ProductShell>
  );
}
