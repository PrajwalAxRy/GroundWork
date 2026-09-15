'use client';

import { GroundworkMark, ProductShell } from '@/components/product/product-shell';
import { Button, Feedback } from '@/components/ui/product-primitives';
import type { Idea, ShapeMessage, ShapeSession, SummaryField } from '@/lib/contracts/product';
import { provenanceCopy } from '@/lib/fixtures/shapes';
import { mockProductService } from '@/lib/services/product-service';
import { AlertTriangle, Check, ChevronDown, ChevronLeft, Info, Send } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react';

const currentFactPattern =
  /\b(competitors?|pricing|prices?|market size|revenue|regulations?|laws?|current alternatives?)\b/i;

function messageId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function assistantReply(message: string): {
  body: string;
  note?: string;
  researchQuestion?: string;
  updatedField?: SummaryField;
} {
  if (currentFactPattern.test(message)) {
    return {
      body: 'That needs current market research, so I will not guess from memory. I have added it to your Investigation questions. For shaping this version now, which alternative do you most expect your customer to keep using if they do not choose you?',
      note: `Saved for Investigation: ${message}`,
      researchQuestion: message,
    };
  }
  return {
    body: 'That makes the first version more specific. The next useful pressure test is the moment someone decides the current workaround is no longer good enough. What happens immediately before they start looking for another option?',
    updatedField: {
      label: 'Primary uncertainty',
      value: 'What triggers the customer to replace the current workaround.',
      provenance: 'suggested',
    },
  };
}

function SummaryContent({
  shape,
  updatedField,
  compact = false,
}: { shape: ShapeSession; updatedField: string; compact?: boolean }) {
  return (
    <>
      <div className="shape-summary-heading">
        <div>
          <p>Working brief</p>
          <h2>Current idea</h2>
        </div>
        <span className="shape-summary-status">
          <i />
          {shape.frozen ? 'Frozen' : 'Live'}
        </span>
      </div>
      <p className="shape-summary-context">
        {shape.frozen
          ? 'This is the brief used for Investigation.'
          : 'Updated when the conversation meaningfully changes.'}
      </p>
      <dl className={`shape-summary-list ${compact ? 'shape-summary-list--compact' : ''}`}>
        {shape.summary.map((field) => (
          <div
            key={field.label}
            className={`shape-summary-field shape-summary-field--${field.provenance} ${updatedField === field.label ? 'shape-summary-field--updated' : ''}`}
          >
            <div className="shape-summary-field__label">
              <dt>{field.label}</dt>
              <span>{provenanceCopy[field.provenance]}</span>
            </div>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
      {!shape.frozen && (
        <div className="shape-summary-key">
          <span>
            <i className="key-confirmed" />
            Yours
          </span>
          <span>
            <i className="key-groundwork" />
            Groundwork
          </span>
          <span>
            <i className="key-open" />
            Open
          </span>
        </div>
      )}
    </>
  );
}

function Message({ message, onRetry }: { message: ShapeMessage; onRetry: () => void }) {
  if (message.failed) {
    return (
      <article className="shape-response-error" role="alert">
        <span>
          <AlertTriangle aria-hidden="true" />
        </span>
        <div>
          <strong>Response interrupted</strong>
          <p>{message.body}</p>
        </div>
        <button type="button" className="shape-retry-button" onClick={onRetry}>
          Retry response
        </button>
      </article>
    );
  }
  const speaker = message.role === 'assistant' ? 'Groundwork' : 'You';
  return (
    <article className={`shape-message shape-message--${message.role}`}>
      <header>
        <span className="shape-speaker-mark" aria-hidden="true">
          {message.role === 'assistant' && <GroundworkMark />}
        </span>
        <strong>{speaker}</strong>
      </header>
      <div className="shape-message__body">
        <p>{message.body}</p>
        {message.note && (
          <aside className="shape-research-note">
            <Info aria-hidden="true" />
            <span>
              <strong>Research question saved</strong>
              {message.note}
            </span>
          </aside>
        )}
      </div>
    </article>
  );
}

function ShapeLoadingView() {
  return (
    <main
      className="shape-page shape-page--loading"
      aria-busy="true"
      aria-label="Loading Shape conversation"
    >
      <div className="shape-loading-header">
        <i />
        <b />
        <span />
      </div>
      <div className="shape-layout">
        <section className="shape-conversation-paper">
          <div className="shape-loading-messages">
            {[1, 2, 3].map((item) => (
              <article
                key={item}
                className={`shape-loading-message shape-loading-message--${item % 2 ? 'left' : 'right'}`}
              >
                <i />
                <span />
                <span />
              </article>
            ))}
          </div>
        </section>
        <aside className="shape-idea-summary shape-loading-summary">
          <i />
          {[1, 2, 3, 4].map((item) => (
            <span key={item} />
          ))}
        </aside>
      </div>
    </main>
  );
}

export function ShapePageClient({ ideaId, preview }: { ideaId: string; preview?: string }) {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [shape, setShape] = useState<ShapeSession | null>(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(preview === 'load-error');
  const [sending, setSending] = useState(false);
  const [reviewNotice, setReviewNotice] = useState(false);
  const [updatedField, setUpdatedField] = useState('');
  const [failNextResponse, setFailNextResponse] = useState(preview === 'response-failure');
  const threadEnd = useRef<HTMLDivElement>(null);

  const load = useCallback(
    async (force = false) => {
      setLoading(true);
      if (preview === 'load-error' && !force) {
        setLoadError(true);
        setLoading(false);
        return;
      }
      const [nextIdea, nextShape, nextDraft] = await Promise.all([
        mockProductService.getIdea(ideaId),
        mockProductService.getShape(ideaId),
        mockProductService.getDraft(ideaId),
      ]);
      setIdea(nextIdea);
      setShape(nextShape);
      setDraft(nextDraft);
      setLoading(false);
    },
    [ideaId, preview],
  );

  useEffect(() => {
    void load();
  }, [load]);

  async function completeResponse(sourceMessage: string, replacingFailure = false) {
    const reply = assistantReply(sourceMessage);
    if (reply.researchQuestion)
      await mockProductService.addInvestigationQuestion(ideaId, reply.researchQuestion);
    if (reply.updatedField) await mockProductService.updateSummaryField(ideaId, reply.updatedField);
    const response: ShapeMessage = {
      id: messageId('assistant'),
      role: 'assistant',
      body: reply.body,
      note: reply.note,
    };
    const next = replacingFailure
      ? await mockProductService.replaceFailedShapeMessage(ideaId, response)
      : await mockProductService.appendShapeMessage(ideaId, response);
    setShape(next);
    setSending(false);
    setUpdatedField(reply.updatedField?.label ?? '');
    window.setTimeout(
      () => threadEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
      0,
    );
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !shape) return;
    const message = draft.trim();
    if (!message) return;
    const next = await mockProductService.appendShapeMessage(ideaId, {
      id: messageId('user'),
      role: 'user',
      body: message,
    });
    setShape(next);
    setDraft('');
    setUpdatedField('');
    setSending(true);
    window.setTimeout(async () => {
      if (failNextResponse) {
        setFailNextResponse(false);
        setSending(false);
        setShape(
          await mockProductService.appendShapeMessage(ideaId, {
            id: messageId('failure'),
            role: 'assistant',
            body: 'Groundwork could not respond. Your message is still in the conversation.',
            failed: true,
          }),
        );
        return;
      }
      await completeResponse(message);
    }, 900);
  }

  async function retryResponse() {
    if (!shape) return;
    const source =
      [...shape.messages].reverse().find((message) => message.role === 'user')?.body ?? '';
    setSending(true);
    window.setTimeout(() => void completeResponse(source, true), 800);
  }

  if (loading || preview === 'loading')
    return (
      <ProductShell>
        <ShapeLoadingView />
      </ProductShell>
    );
  if (loadError)
    return (
      <ProductShell>
        <main className="shape-page">
          <Feedback
            title="The conversation could not load."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setLoadError(false);
                  void load(true);
                }}
              >
                Try again
              </Button>
            }
          >
            Your saved messages have not changed.
          </Feedback>
          <Link className="shape-back-link" href="/ideas">
            <ChevronLeft aria-hidden="true" />
            Your ideas
          </Link>
        </main>
      </ProductShell>
    );
  if (!idea || !shape)
    return (
      <ProductShell>
        <main className="shape-page">
          <Feedback title="That Idea is not available.">
            It may have been removed, or this link may be incomplete.
          </Feedback>
          <Link className="shape-back-link" href="/ideas">
            <ChevronLeft aria-hidden="true" />
            Your ideas
          </Link>
        </main>
      </ProductShell>
    );

  const confirmedCount = shape.summary.filter((field) => field.provenance === 'confirmed').length;

  return (
    <ProductShell>
      <main className="shape-page">
        <header className="shape-page-header">
          <Link href="/ideas" className="shape-back-link">
            <ChevronLeft aria-hidden="true" />
            Your ideas
          </Link>
          <div className="shape-page-heading">
            <div>
              <div className="shape-stage-line">
                <span>Shape</span>
                <i />
                <span>{shape.readiness}</span>
              </div>
              <h1>{idea.title}</h1>
            </div>
            {shape.frozen && <span className="shape-frozen-badge">Read-only transcript</span>}
          </div>
        </header>

        {shape.frozen && (
          <aside className="shape-frozen-notice">
            <Check aria-hidden="true" />
            <div>
              <strong>This Idea was frozen when Investigation began.</strong>
              <span>You can read the conversation, but material changes start a new Idea.</span>
            </div>
            <button type="button">Open investigation</button>
          </aside>
        )}
        {!shape.frozen && reviewNotice && (
          <output className="shape-review-notice">
            <Check aria-hidden="true" />
            <div>
              <strong>Your working brief is ready to review.</strong>
              <span>You can still return to this conversation before starting Investigation.</span>
            </div>
            <button type="button" onClick={() => setReviewNotice(false)}>
              Keep shaping
            </button>
          </output>
        )}

        <details className="shape-mobile-summary">
          <summary>
            <span>
              <small>Current idea</small>
              {shape.frozen
                ? 'Frozen brief'
                : `${confirmedCount} confirmed detail${confirmedCount === 1 ? '' : 's'}`}
            </span>
            <ChevronDown aria-hidden="true" />
          </summary>
          <div>
            <SummaryContent shape={shape} updatedField={updatedField} compact />
          </div>
        </details>

        <div className="shape-layout">
          <section className="shape-conversation-paper" aria-label="Shape conversation">
            <div className="shape-conversation-intro">
              <span>
                <GroundworkMark />
              </span>
              <div>
                <strong>Your cofounder workspace</strong>
                <p>
                  Think out loud. I will help sharpen the idea and keep the working brief current.
                </p>
              </div>
            </div>
            <div className="shape-thread">
              {shape.messages.map((message) => (
                <Message key={message.id} message={message} onRetry={() => void retryResponse()} />
              ))}
              {sending && (
                <article
                  className="shape-message shape-message--assistant shape-message--pending"
                  aria-label="Groundwork is responding"
                  aria-busy="true"
                >
                  <header>
                    <span className="shape-speaker-mark">
                      <GroundworkMark />
                    </span>
                    <strong>Groundwork</strong>
                    <span className="shape-thinking-label">Thinking through your answer</span>
                  </header>
                  <div className="shape-pending-lines">
                    <i />
                    <i />
                    <i />
                  </div>
                </article>
              )}
              <div ref={threadEnd} />
            </div>
            {!shape.frozen && (
              <footer className="shape-composer-wrap">
                <form className="shape-composer" onSubmit={(event) => void sendMessage(event)}>
                  <label className="sr-only" htmlFor="shape-message-input">
                    Message Groundwork
                  </label>
                  <textarea
                    id="shape-message-input"
                    rows={2}
                    placeholder="Add a detail, question an assumption, or correct the brief…"
                    disabled={sending}
                    value={draft}
                    onChange={(event) => {
                      setDraft(event.target.value);
                      void mockProductService.saveDraft(ideaId, event.target.value);
                    }}
                  />
                  <div className="shape-composer-actions">
                    <span>
                      {sending
                        ? 'Your message is saved in the conversation.'
                        : 'Shape does not search the internet.'}
                    </span>
                    <button type="submit" className="shape-send-button" disabled={sending}>
                      {sending ? (
                        <>
                          <i className="shape-button-spinner" />
                          Responding
                        </>
                      ) : (
                        <>
                          Send <Send aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
                <button
                  type="button"
                  className="shape-review-button"
                  onClick={() => setReviewNotice(true)}
                >
                  Review idea
                </button>
              </footer>
            )}
          </section>
          <aside className="shape-idea-summary" aria-label="Current idea summary">
            <SummaryContent shape={shape} updatedField={updatedField} />
          </aside>
        </div>
        <p className="sr-only" aria-live="polite">
          {sending ? 'Groundwork is preparing a response.' : ''}
        </p>
      </main>
    </ProductShell>
  );
}
