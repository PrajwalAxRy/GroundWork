import { ProductShell } from '@/components/product/product-shell';
import styles from '@/components/shape/shape-conversation-experiment.module.css';
import { MessageCircleMore } from 'lucide-react';

export default function LoadingShape() {
  return (
    <ProductShell>
      <main className={styles.routeState} aria-label="Loading Shape conversation">
        <span className={styles.routeStateIcon} aria-hidden="true">
          <MessageCircleMore />
        </span>
        <h1>Loading your Shape conversation…</h1>
        <div className={styles.routeStateSkeleton} aria-hidden="true" />
      </main>
    </ProductShell>
  );
}
