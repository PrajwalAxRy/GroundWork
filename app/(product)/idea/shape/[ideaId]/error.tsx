'use client';

import { ProductShell } from '@/components/product/product-shell';
import styles from '@/components/shape/shape-conversation-experiment.module.css';
import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ShapeRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ProductShell>
      <main className={styles.routeState}>
        <span className={styles.routeStateIcon} aria-hidden="true">
          <AlertCircle />
        </span>
        <h1>Shape could not be loaded</h1>
        <p>Your saved conversation has not been changed. Try loading it again.</p>
        <div className={styles.routeStateActions}>
          <Link href="/ideas">
            <ArrowLeft aria-hidden="true" />
            Your ideas
          </Link>
          <button type="button" onClick={reset}>
            <RotateCcw aria-hidden="true" />
            Try again
          </button>
        </div>
      </main>
    </ProductShell>
  );
}
