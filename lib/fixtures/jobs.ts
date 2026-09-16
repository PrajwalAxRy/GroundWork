import { PROTOTYPE_INVESTIGATION_CREDITS } from '@/lib/config/prototype-commercial';
import type { ProductJob } from '@/lib/contracts/product';

export const investigationJobs: ProductJob[] = [
  {
    id: 'job-investigation-idea-03',
    ideaId: 'idea-03',
    kind: 'investigation',
    state: 'verifying',
    phaseLabel: 'Checking claims and sources',
    reservedCredits: PROTOTYPE_INVESTIGATION_CREDITS,
    creditsReleased: false,
  },
  {
    id: 'job-investigation-idea-04',
    ideaId: 'idea-04',
    kind: 'investigation',
    state: 'completed',
    phaseLabel: 'Report ready',
    reservedCredits: PROTOTYPE_INVESTIGATION_CREDITS,
    creditsReleased: false,
  },
  {
    id: 'job-investigation-idea-05',
    ideaId: 'idea-05',
    kind: 'investigation',
    state: 'failed',
    phaseLabel: 'Gathering customer and demand evidence',
    reservedCredits: PROTOTYPE_INVESTIGATION_CREDITS,
    creditsReleased: true,
  },
];
