'use client';

import { ShapeWorkspace } from '@/components/shape/shape-workspace';
import { PROTOTYPE_INITIAL_CREDITS } from '@/lib/config/prototype-commercial';
import { shapeResponseFailureSession } from '@/lib/fixtures/shapes';
import { useState } from 'react';

export function ShapeStatesExperiment() {
  const [session, setSession] = useState(() => structuredClone(shapeResponseFailureSession));
  const [retrying, setRetrying] = useState(false);

  async function retryResponse() {
    setRetrying(true);
    setSession((current) => ({
      ...current,
      readiness: 'Still taking shape',
      messages: current.messages.map((message) =>
        message.failed
          ? {
              id: 'failure-assistant-retried',
              role: 'assistant' as const,
              body: 'That points to coordination speed as the real value. Is the first useful version a replacement finder, or a clearer rota that prevents gaps earlier?',
            }
          : message,
      ),
    }));
    setRetrying(false);
  }

  return (
    <ShapeWorkspace
      mode="experiment"
      ideaTitle="Volunteer rota for community kitchens"
      session={session}
      draft=""
      credits={PROTOTYPE_INITIAL_CREDITS}
      saveStatus={retrying ? 'Retrying…' : 'Response failed'}
      pendingAction={retrying ? 'retrying' : null}
      onDraftChange={() => undefined}
      onSend={async () => undefined}
      onRetryResponse={retryResponse}
    />
  );
}
