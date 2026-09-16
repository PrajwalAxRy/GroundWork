import type { IdeaBrief } from '@/lib/contracts/product';

export type ConfirmScenarioKey = 'ready' | 'deferred' | 'assumptions' | 'insufficient' | 'failure';

export type BriefReviewField = IdeaBrief['fields'][number] & {
  origin: 'user' | 'groundwork' | 'conflicting';
  guidance: string;
};

export type ConfirmIdeaScenario = {
  key: ConfirmScenarioKey;
  label: string;
  description: string;
  balance: number;
  fields: BriefReviewField[];
  questions: string[];
  submissionFailure?: boolean;
};

const confirmedFields: BriefReviewField[] = [
  {
    key: 'idea',
    label: 'Idea summary',
    value:
      'A lightweight scheduling and deposit tool that helps independent clinics reduce no-shows without changing their existing calendar.',
    status: 'confirmed',
    origin: 'user',
    guidance: 'The version Groundwork will investigate.',
  },
  {
    key: 'problem',
    label: 'Problem',
    value:
      'Late cancellations leave specialist time unused, while current reminder tools do little to recover the revenue or prevent repeat behavior.',
    status: 'confirmed',
    origin: 'user',
    guidance: 'The costly moment this idea is intended to improve.',
  },
  {
    key: 'targetUser',
    label: 'Target customer',
    value: 'Owner-operated physiotherapy and allied-health clinics with two to ten practitioners.',
    status: 'confirmed',
    origin: 'user',
    guidance: 'The first customer segment, not the whole possible market.',
  },
  {
    key: 'buyer',
    label: 'Buyer',
    value: 'The clinic owner or practice manager who controls scheduling and payment policies.',
    status: 'assumption',
    origin: 'groundwork',
    guidance: 'Groundwork inferred this from the Shape conversation.',
  },
  {
    key: 'solution',
    label: 'Proposed solution',
    value:
      'A small layer on top of the clinic calendar that collects deposits, sends policy-aware reminders, and flags repeat no-show risk.',
    status: 'confirmed',
    origin: 'user',
    guidance: 'The product boundary for this Investigation.',
  },
  {
    key: 'valueProposition',
    label: 'Value proposition',
    value:
      'Recover more booked revenue without forcing a clinic to replace its practice-management system.',
    status: 'assumption',
    origin: 'groundwork',
    guidance: 'Groundwork proposed this as the clearest commercial promise.',
  },
  {
    key: 'geography',
    label: 'Market or geography',
    value: 'English-speaking independent clinics in Australia and New Zealand.',
    status: 'confirmed',
    origin: 'user',
    guidance: 'Research sources and regulatory context will use this boundary.',
  },
  {
    key: 'businessModel',
    label: 'Likely business model',
    value:
      'Monthly clinic subscription, with pricing likely tied to practitioner count or appointment volume.',
    status: 'assumption',
    origin: 'groundwork',
    guidance: 'The Investigation can test plausible pricing structures.',
  },
  {
    key: 'criticalAssumptions',
    label: 'Important assumptions',
    value:
      'Clinics can introduce deposits without unacceptable patient drop-off, and existing calendar systems expose enough integration surface for a focused first product.',
    status: 'investigate',
    origin: 'conflicting',
    guidance: 'Your answers point to both customer value and adoption risk here.',
  },
];

function cloneFields(): BriefReviewField[] {
  return confirmedFields.map((field) => ({ ...field }));
}

export const confirmIdeaScenarios: Record<ConfirmScenarioKey, ConfirmIdeaScenario> = {
  ready: {
    key: 'ready',
    label: 'Mostly confirmed',
    description: 'A clear brief with enough detail to begin research.',
    balance: 18,
    fields: cloneFields(),
    questions: [
      'How common and costly are no-shows for the first clinic segment?',
      'Which scheduling products already offer deposits or no-show controls?',
      'What evidence exists about patient response to deposit policies?',
    ],
  },
  deferred: {
    key: 'deferred',
    label: 'Several unknowns',
    description: 'Intentional uncertainty is included in the research scope.',
    balance: 18,
    fields: cloneFields().map((field) =>
      field.key === 'buyer' || field.key === 'businessModel' || field.key === 'criticalAssumptions'
        ? { ...field, status: 'investigate' as const }
        : field,
    ),
    questions: [
      'Who feels the cost of no-shows strongly enough to own this purchase?',
      'Which pricing model best matches clinic value and buying habits?',
      'Would deposits reduce demand or improve appointment commitment?',
    ],
  },
  assumptions: {
    key: 'assumptions',
    label: 'Assumptions to review',
    description: 'Groundwork interpretations are waiting for a deliberate decision.',
    balance: 18,
    fields: cloneFields().map((field) =>
      field.origin === 'groundwork' ? { ...field, status: 'assumption' as const } : field,
    ),
    questions: [
      'Which role owns scheduling-policy decisions in small clinics?',
      'What outcome creates enough value to support recurring software spend?',
    ],
  },
  insufficient: {
    key: 'insufficient',
    label: 'Insufficient credits',
    description: 'The brief is ready, but credits must be added before research.',
    balance: 0,
    fields: cloneFields(),
    questions: [
      'How common and costly are no-shows for the first clinic segment?',
      'Which scheduling products already offer deposits or no-show controls?',
    ],
  },
  failure: {
    key: 'failure',
    label: 'Start failure',
    description: 'A recoverable failure keeps every brief edit intact.',
    balance: 18,
    fields: cloneFields(),
    questions: [
      'How common and costly are no-shows for the first clinic segment?',
      'Which scheduling products already offer deposits or no-show controls?',
    ],
    submissionFailure: true,
  },
};
