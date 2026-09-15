import { ProductShell } from '@/components/product/product-shell';

export default function IdeasLoading() {
  return (
    <ProductShell>
      <main className="ideas-page" aria-label="Loading ideas" aria-busy="true">
        <section className="loading-stack">
          {[1, 2, 3].map((item) => (
            <div className="skeleton-card" key={item}>
              <i />
              <b />
              <span />
              <footer />
            </div>
          ))}
        </section>
      </main>
    </ProductShell>
  );
}
