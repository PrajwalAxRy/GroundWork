import { ProductShell } from '@/components/product/product-shell';

export default function ShapeLoading() {
  return (
    <ProductShell>
      <main
        className="shape-page shape-page--loading"
        aria-busy="true"
        aria-label="Loading Shape conversation"
      >
        <div className="shape-loading-header">
          <i />
          <b />
          <span />
        </div>
        <div className="shape-layout">
          <section className="shape-conversation-paper">
            <div className="shape-loading-messages">
              {[1, 2, 3].map((item) => (
                <article
                  key={item}
                  className={`shape-loading-message shape-loading-message--${item % 2 ? 'left' : 'right'}`}
                >
                  <i />
                  <span />
                  <span />
                </article>
              ))}
            </div>
          </section>
          <aside className="shape-idea-summary shape-loading-summary">
            <i />
            {[1, 2, 3, 4].map((item) => (
              <span key={item} />
            ))}
          </aside>
        </div>
      </main>
    </ProductShell>
  );
}
