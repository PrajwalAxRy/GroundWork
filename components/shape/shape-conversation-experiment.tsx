'use client';

import { ShapeWorkspace } from '@/components/shape/shape-workspace';
import {
  PROTOTYPE_INITIAL_CREDITS,
  PROTOTYPE_INVESTIGATION_CREDITS,
} from '@/lib/config/prototype-commercial';
import type { ShapeSession } from '@/lib/contracts/product';
import { shapeSessions } from '@/lib/fixtures/shapes';
import { useState } from 'react';

type ShapeConversationExperimentProps = {
  mode?: 'experiment' | 'product';
};

export function ShapeConversationExperiment({
  mode = 'experiment',
}: ShapeConversationExperimentProps) {
  const [session, setSession] = useState<ShapeSession | null>(null);
  const [draft, setDraft] = useState('');
  const [credits, setCredits] = useState(PROTOTYPE_INITIAL_CREDITS);

  async function sendMessage() {
    const content = draft.trim();
    if (!content) return;

    setSession((current) => {
      if (!current) {
        return {
          ideaId: 'experiment-shape',
          lifecycle: 'shaping',
          readiness: 'Still taking shape',
          summary: [
            { label: 'Idea', value: content, provenance: 'confirmed' },
            { label: 'Target user', value: 'Not clear yet', provenance: 'unknown' },
            { label: 'Problem', value: 'Not clear yet', provenance: 'unknown' },
          ],
          messages: [
            { id: 'experiment-user-1', role: 'user', body: content },
            {
              id: 'experiment-assistant-1',
              role: 'assistant',
              body: 'Let’s make the problem concrete before settling on a solution. Who runs into this most often, and what do they do today when it happens?',
            },
          ],
          openQuestions: [],
        };
      }

      return {
        ...current,
        messages: [
          ...current.messages,
          { id: `experiment-user-${current.messages.length + 1}`, role: 'user', body: content },
          {
            id: `experiment-assistant-${current.messages.length + 2}`,
            role: 'assistant',
            body: 'That helps narrow the idea. What is the smallest result they would value enough to try?',
          },
        ],
      };
    });
    setDraft('');
  }

  async function acceptSummary() {
    if (!session) return false;
    const summary = session.summary.find((field) => field.label === 'Idea')?.value;
    if (!summary) return false;
    setSession({
      ...session,
      lifecycle: 'review_paused',
      acceptedSummary: summary,
      readiness: 'Summary accepted',
    });
    return true;
  }

  async function resumeShape() {
    if (!session) return;
    const { acceptedSummary: _acceptedSummary, ...editableSession } = session;
    setSession({ ...editableSession, lifecycle: 'shaping', readiness: 'Still taking shape' });
  }

  async function startInvestigation() {
    if (!session?.acceptedSummary) return false;
    setSession({ ...session, lifecycle: 'frozen', readiness: 'Idea frozen' });
    setCredits((current) => current - PROTOTYPE_INVESTIGATION_CREDITS);
    return true;
  }

  function reset() {
    setSession(null);
    setDraft('');
    setCredits(PROTOTYPE_INITIAL_CREDITS);
  }

  function previewConversation() {
    setSession(structuredClone(shapeSessions[0]));
    setDraft('');
  }

  return (
    <ShapeWorkspace
      mode={mode}
      ideaTitle={session ? 'A calmer inbox for small clinics' : 'New idea'}
      session={session}
      draft={draft}
      credits={credits}
      saveStatus={
        session?.lifecycle === 'frozen'
          ? 'Idea frozen'
          : session?.lifecycle === 'review_paused'
            ? 'Summary accepted'
            : session
              ? 'Saved'
              : 'Draft'
      }
      onDraftChange={setDraft}
      onSend={sendMessage}
      onAcceptSummary={session ? acceptSummary : undefined}
      onResumeShape={resumeShape}
      onStartInvestigation={startInvestigation}
      onStartOver={mode === 'experiment' ? reset : undefined}
      onPreviewConversation={mode === 'experiment' ? previewConversation : undefined}
    />
  );
}
