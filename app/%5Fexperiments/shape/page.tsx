import { ShapeExperiment } from '@/components/shape/shape-experiment';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shape experiment',
  robots: { index: false, follow: false },
};

export default function ShapeExperimentPage() {
  return <ShapeExperiment />;
}
