import type { InvestigationReport } from '@/lib/contracts/product';

export type VerdictLabel = InvestigationReport['verdict']['label'];
export type VerdictScenarioKey =
  | 'worth_pursuing'
  | 'refine_before_pursuing'
  | 'test_critical_assumption'
  | 'major_obstacles'
  | 'reconsider_version';
export type EvidencePreviewKey = 'good' | 'mixed' | 'limited';
export type EvidenceCoverageStatus =
  | 'complete'
  | 'partial'
  | 'insufficient_evidence'
  | 'not_applicable';

export type VerdictScenario = {
  key: VerdictScenarioKey;
  label: VerdictLabel;
  tone: 'positive' | 'caution' | 'negative';
  headline: string;
  summary: string;
  reasons: readonly [string, string, string];
  concern: {
    title: string;
    body: string;
  };
  recommendation: {
    title: string;
    body: string;
    retained: string;
  };
  nextAction: {
    title: string;
    body: string;
  };
};

export type EvidencePreview = {
  key: EvidencePreviewKey;
  label: string;
  confidence: 'High confidence' | 'Moderate confidence' | 'Low confidence';
  summary: string;
  areas: ReadonlyArray<{
    label: string;
    status: EvidenceCoverageStatus;
  }>;
};

export const verdictScenarios = {
  worth_pursuing: {
    key: 'worth_pursuing',
    label: 'Worth pursuing',
    tone: 'positive',
    headline: 'A focused clinic workflow product has a credible opening.',
    summary:
      'The evidence supports moving forward with a narrow first version for independent outpatient clinics, where inbox overload is visible and the buying path is relatively direct.',
    reasons: [
      'Clinic teams already combine several general-purpose tools to manage the same workflow.',
      'The problem recurs daily and creates clear administrative cost, not just mild inconvenience.',
      'A narrow integration-led product can prove value before expanding into a broader platform.',
    ],
    concern: {
      title: 'Integration reliability will decide trust',
      body: 'A useful interface will not compensate for missed messages or incomplete synchronization with existing clinical systems.',
    },
    recommendation: {
      title: 'Start with independent outpatient clinics',
      body: 'Offer one shared inbox for referral, patient, and internal messages, with clear ownership and escalation rather than a broad communications suite.',
      retained: 'Keep the calmer triage experience and the promise of fewer dropped handoffs.',
    },
    nextAction: {
      title: 'Validate the integration wedge',
      body: 'Interview eight clinic administrators and test which single inbox source they would connect first.',
    },
  },
  refine_before_pursuing: {
    key: 'refine_before_pursuing',
    label: 'Refine before pursuing',
    tone: 'caution',
    headline: 'The problem is credible, but the current product promise is too broad.',
    summary:
      'Small clinics do struggle with fragmented messages, yet a universal inbox would enter too many workflows at once. A narrower referral-handoff product has a clearer buyer and proof point.',
    reasons: [
      'The pain is strongest around referral follow-up, where ownership is unclear and delays are costly.',
      'Existing tools solve parts of the workflow, so a broad replacement pitch would face high switching resistance.',
      'Independent clinics offer a faster buying path than hospital groups, but need a smaller initial commitment.',
    ],
    concern: {
      title: 'The first version asks clinics to change too much',
      body: 'Replacing every communication channel creates a long implementation cycle before the product can demonstrate value.',
    },
    recommendation: {
      title: 'Narrow the product to referral handoffs',
      body: 'Begin with one shared queue for inbound referrals, ownership, and follow-up, then expand only after clinics rely on that workflow.',
      retained: 'Keep the calm interface, shared accountability, and small-clinic focus.',
    },
    nextAction: {
      title: 'Test the narrower promise',
      body: 'Show a referral-only workflow to eight clinic administrators and ask what would need to be true for a 30-day pilot.',
    },
  },
  test_critical_assumption: {
    key: 'test_critical_assumption',
    label: 'Test the critical assumption',
    tone: 'caution',
    headline: 'Demand depends on whether clinics will connect real message sources.',
    summary:
      'The workflow pain is visible, but the opportunity turns on one unresolved behavior: whether clinics will grant the access needed for a unified queue before the product has an established trust record.',
    reasons: [
      'Administrative teams describe costly handoff failures across referral and patient-message channels.',
      'Most alternatives organize work after it arrives rather than consolidating the sources themselves.',
      'Security review and integration access could block adoption before users experience the benefit.',
    ],
    concern: {
      title: 'Access may be harder than demand',
      body: 'Positive interviews are not enough if clinics cannot authorize a useful integration within a lightweight pilot.',
    },
    recommendation: {
      title: 'Keep the idea, reduce the proof required',
      body: 'Prototype a read-only referral queue that imports one source and demonstrates ownership without changing the clinic system of record.',
      retained: 'Keep the shared triage model and the focus on dropped handoffs.',
    },
    nextAction: {
      title: 'Run an access test before building',
      body: 'Ask five clinics to complete a realistic integration-approval walkthrough using a read-only prototype.',
    },
  },
  major_obstacles: {
    key: 'major_obstacles',
    label: 'Major obstacles',
    tone: 'negative',
    headline: 'The current route to market is blocked by integration and trust costs.',
    summary:
      'The underlying problem matters, but the proposed product requires deep system access, security review, and workflow replacement before a small clinic can see value.',
    reasons: [
      'The strongest product benefit appears only after several message sources are connected.',
      'Small clinics have limited technical capacity and rely heavily on incumbent vendors for integration approval.',
      'Competing workflow tools can add lighter triage features without asking buyers to adopt another system.',
    ],
    concern: {
      title: 'Time to first value is too long',
      body: 'The product carries enterprise-style onboarding cost without the contract size or internal support of an enterprise buyer.',
    },
    recommendation: {
      title: 'Change the wedge before pursuing software',
      body: 'Explore a managed referral-audit service or a single-channel tool that produces value without deep integrations, then earn the right to automate more.',
      retained: 'Keep the small-clinic problem and the focus on referral leakage.',
    },
    nextAction: {
      title: 'Test a no-integration service',
      body: 'Run two manual referral audits and measure whether clinics will pay to recover missed follow-ups.',
    },
  },
  reconsider_version: {
    key: 'reconsider_version',
    label: 'Reconsider this version',
    tone: 'negative',
    headline: 'This version adds another inbox without removing the existing work.',
    summary:
      'The evidence does not support a standalone universal inbox for small clinics. Buyers already face tool fatigue, and the proposed version depends on adoption across too many roles and systems.',
    reasons: [
      'Most clinics cannot retire their existing patient portal, email, fax, and record-system queues.',
      'The product would introduce another place to check unless it achieved near-complete integration coverage.',
      'No clear buyer was found who owns both the budget and the cross-system workflow change.',
    ],
    concern: {
      title: 'The product may increase the fragmentation it promises to fix',
      body: 'Without replacing existing queues, a new aggregation layer creates extra monitoring and another failure point.',
    },
    recommendation: {
      title: 'Return to the outcome, not the inbox',
      body: 'Reframe the idea around preventing referral leakage, then consider service, reporting, or workflow-assist models that do not require a new daily destination.',
      retained: 'Keep the customer problem, but release the universal-inbox solution.',
    },
    nextAction: {
      title: 'Re-interview around the lost outcome',
      body: 'Ask clinic owners how they detect and value missed referrals without presenting an inbox concept.',
    },
  },
} as const satisfies Record<VerdictScenarioKey, VerdictScenario>;

export const evidencePreviews = {
  good: {
    key: 'good',
    label: 'Good coverage',
    confidence: 'High confidence',
    summary: 'The conclusion is supported across the questions that most affect the decision.',
    areas: [
      { label: 'Customer and problem', status: 'complete' },
      { label: 'Competitive landscape', status: 'complete' },
      { label: 'Business reality', status: 'complete' },
      { label: 'Market sizing', status: 'partial' },
      { label: 'Manufacturing', status: 'not_applicable' },
    ],
  },
  mixed: {
    key: 'mixed',
    label: 'Mixed coverage',
    confidence: 'Moderate confidence',
    summary:
      'The direction is useful, with important gaps called out rather than filled with estimates.',
    areas: [
      { label: 'Customer and problem', status: 'complete' },
      { label: 'Competitive landscape', status: 'partial' },
      { label: 'Business reality', status: 'partial' },
      { label: 'Market sizing', status: 'insufficient_evidence' },
      { label: 'Manufacturing', status: 'not_applicable' },
    ],
  },
  limited: {
    key: 'limited',
    label: 'Limited coverage',
    confidence: 'Low confidence',
    summary:
      'The conclusion is provisional because several decision-critical questions remain unresolved.',
    areas: [
      { label: 'Customer and problem', status: 'partial' },
      { label: 'Competitive landscape', status: 'partial' },
      { label: 'Business reality', status: 'insufficient_evidence' },
      { label: 'Market sizing', status: 'insufficient_evidence' },
      { label: 'Manufacturing', status: 'not_applicable' },
    ],
  },
} as const satisfies Record<EvidencePreviewKey, EvidencePreview>;
