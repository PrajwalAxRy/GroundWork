import { ProductShell } from '@/components/product/product-shell';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shape' };

export default function NewIdeaShapePage() {
  return (
    <ProductShell>
      <main className="ideas-page">
        <h1>Shape page will come here</h1>
      </main>
    </ProductShell>
  );
}
