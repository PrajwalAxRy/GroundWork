'use client';

import { ProductShell } from '@/components/product/product-shell';
import { ShapeWorkspace } from '@/components/shape/shape-workspace';
import type { CreditBalance, Idea, ProductJob, ShapeSession } from '@/lib/contracts/product';
import { mockProductService } from '@/lib/services/product-service';
import { AlertCircle, ArrowLeft, MessageCircleMore, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import styles from './shape-conversation-experiment.module.css';

type LoadState = 'loading' | 'ready' | 'not_found' | 'error';
type PendingAction = 'sending' | 'retrying' | 'accepting' | 'resuming' | 'starting' | null;

export function ShapePageClient({ ideaId }: { ideaId: string }) {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [idea, setIdea] = useState<Idea | null>(null);
  const [session, setSession] = useState<ShapeSession | null>(null);
  const [job, setJob] = useState<ProductJob | null>(null);
  const [creditBalance, setCreditBalance] = useState<CreditBalance>({ available: 10, reserved: 0 });
  const [draft, setDraft] = useState('');
  const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'failed'>('saved');
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadState('loading');
    setActionError(null);
    try {
      const [loadedIdea, loadedShape, loadedDraft, loadedBalance, loadedJob] = await Promise.all([
        mockProductService.getIdea(ideaId),
        mockProductService.getShape(ideaId),
        mockProductService.getDraft(ideaId),
        mockProductService.getCreditBalance(),
        mockProductService.getJob(ideaId, 'investigation'),
      ]);

      setCreditBalance(loadedBalance);

      if (!loadedIdea || !loadedShape) {
        setLoadState('not_found');
        return;
      }

      setIdea(loadedIdea);
      setSession(loadedShape);
      setDraft(loadedShape.lifecycle === 'shaping' ? loadedDraft : '');
      setJob(loadedJob);
      setDraftStatus('saved');
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, [ideaId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (loadState !== 'ready' || session?.lifecycle !== 'shaping' || draftStatus !== 'saving') {
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        await mockProductService.saveDraft(ideaId, draft);
        setDraftStatus('saved');
      } catch {
        setDraftStatus('failed');
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [draft, draftStatus, ideaId, loadState, session?.lifecycle]);

  function changeDraft(value: string) {
    setDraft(value);
    setDraftStatus('saving');
    setActionError(null);
  }

  async function saveDraftNow() {
    if (session?.lifecycle !== 'shaping' || draftStatus !== 'saving') return;
    try {
      await mockProductService.saveDraft(ideaId, draft);
      setDraftStatus('saved');
    } catch {
      setDraftStatus('failed');
    }
  }

  async function sendMessage() {
    const content = draft.trim();
    if (!content || pendingAction) return;
    setPendingAction('sending');
    setActionError(null);
    try {
      const updated = await mockProductService.submitShapeTurn(ideaId, content);
      if (!updated) throw new Error('This conversation is no longer editable.');
      setSession(updated);
      setDraft('');
      setDraftStatus('saved');
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Your message could not be sent. Please try again.',
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function retryResponse() {
    if (pendingAction) return;
    setPendingAction('retrying');
    setActionError(null);
    try {
      const updated = await mockProductService.retryShapeResponse(ideaId);
      if (!updated) throw new Error('This response could not be retried.');
      setSession(updated);
      if (updated.messages.some((message) => message.failed)) {
        setActionError('Groundwork still could not respond. Your message remains saved.');
      }
    } catch {
      setActionError('Groundwork still could not respond. Your message remains saved.');
    } finally {
      setPendingAction(null);
    }
  }

  async function acceptSummary() {
    if (pendingAction) return false;
    setPendingAction('accepting');
    setActionError(null);
    try {
      const updated = await mockProductService.acceptShapeSummary(ideaId);
      if (!updated) throw new Error('The summary could not be accepted.');
      setSession(updated);
      setDraft('');
      setDraftStatus('saved');
      return true;
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'The summary could not be accepted. Try again.',
      );
      return false;
    } finally {
      setPendingAction(null);
    }
  }

  async function resumeShape() {
    if (pendingAction) return;
    setPendingAction('resuming');
    setActionError(null);
    try {
      const updated = await mockProductService.resumeShape(ideaId);
      if (!updated) throw new Error('Shape could not be resumed.');
      setSession(updated);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Shape could not be resumed. Try again.',
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function startInvestigation() {
    if (pendingAction) return false;
    setPendingAction('starting');
    setActionError(null);
    try {
      const result = await mockProductService.startInvestigation(ideaId);
      setSession(result.session);
      setJob(result.job);
      setCreditBalance(result.creditBalance);
      return true;
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Investigation could not be started. Your accepted summary is unchanged.',
      );
      return false;
    } finally {
      setPendingAction(null);
    }
  }

  if (loadState === 'loading') {
    return <ShapeRouteState kind="loading" credits={creditBalance.available} />;
  }

  if (loadState === 'not_found') {
    return <ShapeRouteState kind="not_found" credits={creditBalance.available} />;
  }

  if (loadState === 'error' || !idea || !session) {
    return (
      <ShapeRouteState kind="error" credits={creditBalance.available} onRetry={() => void load()} />
    );
  }

  const saveStatus =
    pendingAction === 'sending'
      ? 'Sending…'
      : session.lifecycle === 'frozen'
        ? 'Idea frozen'
        : session.lifecycle === 'review_paused'
          ? 'Summary accepted'
          : draftStatus === 'saving'
            ? 'Saving…'
            : draftStatus === 'failed'
              ? 'Draft not saved'
              : 'Saved';

  return (
    <ShapeWorkspace
      ideaTitle={idea.title}
      session={session}
      investigationJob={job}
      draft={draft}
      credits={creditBalance.available}
      saveStatus={saveStatus}
      pendingAction={pendingAction}
      actionError={actionError}
      onDraftChange={changeDraft}
      onDraftBlur={() => void saveDraftNow()}
      onSend={sendMessage}
      onRetryResponse={retryResponse}
      onAcceptSummary={acceptSummary}
      onResumeShape={resumeShape}
      onStartInvestigation={startInvestigation}
    />
  );
}

function ShapeRouteState({
  kind,
  credits,
  onRetry,
}: {
  kind: 'loading' | 'not_found' | 'error';
  credits: number;
  onRetry?: () => void;
}) {
  return (
    <ProductShell credits={credits}>
      <main className={styles.routeState} aria-live="polite">
        {kind === 'loading' ? (
          <>
            <span className={styles.routeStateIcon} aria-hidden="true">
              <MessageCircleMore />
            </span>
            <h1>Loading your Shape conversation…</h1>
            <div className={styles.routeStateSkeleton} aria-hidden="true" />
          </>
        ) : (
          <>
            <span className={styles.routeStateIcon} aria-hidden="true">
              <AlertCircle />
            </span>
            <h1>{kind === 'not_found' ? 'Idea not found' : 'Shape could not be loaded'}</h1>
            <p>
              {kind === 'not_found'
                ? 'This Idea may have been removed, or the link may be incorrect.'
                : 'Your saved conversation has not been changed. Try loading it again.'}
            </p>
            <div className={styles.routeStateActions}>
              <Link href="/ideas">
                <ArrowLeft aria-hidden="true" />
                Your ideas
              </Link>
              {onRetry ? (
                <button type="button" onClick={onRetry}>
                  <RotateCcw aria-hidden="true" />
                  Try again
                </button>
              ) : null}
            </div>
          </>
        )}
      </main>
    </ProductShell>
  );
}
