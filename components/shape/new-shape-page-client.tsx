'use client';

import { ShapeWorkspace } from '@/components/shape/shape-workspace';
import { PROTOTYPE_INITIAL_CREDITS } from '@/lib/config/prototype-commercial';
import { mockProductService } from '@/lib/services/product-service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function NewShapePageClient() {
  const router = useRouter();
  const [draft, setDraft] = useState('');
  const [credits, setCredits] = useState(PROTOTYPE_INITIAL_CREDITS);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void mockProductService.getCreditBalance().then((balance) => setCredits(balance.available));
  }, []);

  async function createIdea() {
    const content = draft.trim();
    if (!content || pending) return;
    setPending(true);
    setError(null);
    try {
      const idea = await mockProductService.createIdea(content);
      router.replace(`/idea/shape/${idea.id}`);
    } catch {
      setError('Your Idea could not be created. Your text is still here, so you can try again.');
      setPending(false);
    }
  }

  return (
    <ShapeWorkspace
      ideaTitle="New idea"
      session={null}
      draft={draft}
      credits={credits}
      saveStatus={pending ? 'Creating…' : 'Draft'}
      pendingAction={pending ? 'sending' : null}
      actionError={error}
      onDraftChange={(value) => {
        setDraft(value);
        setError(null);
      }}
      onSend={createIdea}
    />
  );
}
