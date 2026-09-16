import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Idea card iterations',
  robots: { index: false, follow: false },
};

export default function CardIterationsExperimentPage() {
  return (
    <iframe
      className="experiment-archive-frame"
      src="/_experiment-archive/cards-prototypes/index.html"
      title="Idea card iterations"
    />
  );
}
