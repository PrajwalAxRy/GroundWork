'use client';

import { ProductShell } from '@/components/product/product-shell';
import { Button, Feedback } from '@/components/ui/product-primitives';

export default function IdeasError({ reset }: { reset: () => void }) {
  return (
    <ProductShell>
      <main className="ideas-page">
        <Feedback
          title="Your ideas could not load."
          action={
            <Button variant="outline" onClick={reset}>
              Try again
            </Button>
          }
        >
          Your saved ideas have not changed.
        </Feedback>
      </main>
    </ProductShell>
  );
}
