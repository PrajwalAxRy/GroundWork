import { ProductShell } from '@/components/product/product-shell';
import Link from 'next/link';

export default function CreditsPlaceholder() {
  return (
    <ProductShell>
      <main className="gw-simple-state">
        <p>Credits</p>
        <h1>Credit purchasing comes in a later prototype phase.</h1>
        <span>
          The production route exists now so navigation fails intentionally rather than dropping
          into a broken page.
        </span>
        <Link href="/ideas">Return to your ideas</Link>
      </main>
    </ProductShell>
  );
}
