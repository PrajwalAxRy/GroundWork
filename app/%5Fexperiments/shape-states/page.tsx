import { ShapeStatesExperiment } from '@/components/shape/shape-states-experiment';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shape states experiment',
  robots: { index: false, follow: false },
};

export default function ShapeStatesExperimentPage() {
  return <ShapeStatesExperiment />;
}
