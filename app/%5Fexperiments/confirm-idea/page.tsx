import { ConfirmIdeaExperiment } from '@/components/confirm/confirm-idea-experiment';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Confirm Idea experiment' };

export default function ConfirmIdeaExperimentPage() {
  return <ConfirmIdeaExperiment />;
}
