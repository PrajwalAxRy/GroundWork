export type ReportRisk = {
  title: string;
  level: 'Moderate' | 'High';
  summary: string;
  whyItMatters: string;
  cheapestTest: string;
};

export type ReportCompetitor = {
  name: string;
  kind: string;
  website: string;
  summary: string;
  usp: string;
  customer: string;
  location?: string;
  revenue?: string;
  pricing?: string;
  moat: string;
  opportunity: string;
};

export type IdeaVariation = {
  title: string;
  shortLabel: string;
  rationale: string;
};

export const investigationReport2 = {
  idea: {
    title: 'A calmer inbox for small clinics',
    stage: 'Investigation',
    summary:
      'A shared workspace that helps small healthcare teams receive, assign, and follow up on patient messages without losing context.',
    shapeTranscriptHref: '/idea/shape/idea-03',
  },
  research: {
    geography: 'United States',
    completedOn: '16 September 2026',
  },
  conclusion: {
    verdict: 'Refine before pursuing',
    confidence: 'Moderate confidence',
    title: 'Start with referral handoffs, not the whole clinic inbox.',
    summary:
      'The problem is real and costly, but the broad version asks a clinic to replace too many habits at once. A narrower referral workflow is easier to explain, test, and adopt.',
    oneThing:
      'There is a useful business here if the first version solves one visible handoff problem for office managers instead of trying to become a new communication system for everyone.',
    support: [
      'Office managers repeatedly describe missed follow-ups and unclear ownership.',
      'Existing tools usually store messages but do not make handoffs easy to manage.',
    ],
    concern:
      'Small practices are price-sensitive, and a product that needs deep integrations could become expensive to deliver.',
    nextStep:
      'Show a referral-only prototype to eight office managers and ask them to walk through their last missed handoff.',
    evidenceNote:
      'Evidence is strongest around the problem and current workarounds. Willingness to pay still needs a real-world test.',
  },
  variations: {
    recommended: {
      title: 'Referral handoffs for independent clinics',
      shortLabel: 'Referral handoffs',
      rationale:
        'This keeps the original insight but gives the product one urgent workflow, one clear buyer, and a much lighter first rollout.',
    } satisfies IdeaVariation,
    alternatives: [
      {
        title: 'Missed lab-result follow-ups',
        shortLabel: 'Lab-result follow-ups',
        rationale:
          'A more clinical workflow with high urgency, but greater compliance and integration demands.',
      },
      {
        title: 'Prior-authorization handoffs',
        shortLabel: 'Prior authorizations',
        rationale:
          'A costly administrative bottleneck with a stronger ROI story and more specialized competition.',
      },
      {
        title: 'Multi-location referral routing',
        shortLabel: 'Multi-location routing',
        rationale:
          'A higher-value buyer and clearer coordination problem, with a smaller initial customer pool.',
      },
    ] satisfies IdeaVariation[],
    actionId: 'investigate_idea_variation',
    credits: 3,
  },
  customer: {
    lead: 'The clearest starting customer is not every small clinic. It is an independent practice with enough staff for handoffs to break, but without an operations team to fix the process.',
    recommendedSegment: 'Independent clinics with 6–20 staff and two or more providers',
    buyer: 'Office manager or practice owner',
    user: 'Front-desk staff, referral coordinators, and clinical assistants',
    trigger:
      'A referral goes unanswered, a patient calls twice, or the clinic cannot tell who owns the next step.',
    workflow: [
      { title: 'A message arrives', detail: 'By phone, portal, fax, or email.' },
      { title: 'Someone copies it', detail: 'Into a note, spreadsheet, or staff chat.' },
      { title: 'Ownership becomes unclear', detail: 'The follow-up depends on memory.' },
    ],
  },
  competitors: [
    {
      name: 'Klara',
      kind: 'Patient communication platform',
      website: 'klara.com',
      summary:
        'A broad patient-communication platform spanning messaging, scheduling, forms, and practice workflows.',
      usp: 'Brings multiple patient conversations into one established healthcare communication layer.',
      customer: 'Independent practices and multi-location provider groups',
      location: 'New York, United States',
      revenue: 'Private company; no reliable public revenue figure found',
      pricing: 'Custom quote',
      moat: 'Existing practice relationships, workflow breadth, and integrations',
      opportunity:
        'Its breadth can leave room for a lighter product built specifically around referral ownership and overdue handoffs.',
    },
    {
      name: 'Spruce Health',
      kind: 'Healthcare communication suite',
      website: 'sprucehealth.com',
      summary:
        'Secure team and patient communication across calls, texts, faxes, and internal messages.',
      usp: 'A familiar all-in-one communications experience designed around healthcare privacy.',
      customer: 'Small practices, behavioral health teams, and specialty clinics',
      location: 'San Francisco, United States',
      revenue: 'Private company; no reliable public revenue figure found',
      pricing: 'Published plans plus custom options',
      moat: 'Channel coverage and an established secure-communications product',
      opportunity:
        'Communication is central, while structured referral accountability can still require manual conventions.',
    },
    {
      name: 'Artera',
      kind: 'Patient engagement platform',
      website: 'artera.io',
      summary:
        'An enterprise-oriented patient communications platform used by health systems and larger provider groups.',
      usp: 'Large-scale orchestration across channels, campaigns, and complex healthcare organizations.',
      customer: 'Health systems, hospitals, and large ambulatory networks',
      location: 'Santa Barbara, United States',
      revenue: 'Private company; no reliable public revenue figure found',
      pricing: 'Custom enterprise quote',
      moat: 'Enterprise distribution, scale, and broad integration coverage',
      opportunity:
        'Its enterprise posture leaves smaller independent practices looking for a faster, lower-cost workflow tool.',
    },
    {
      name: 'NexHealth',
      kind: 'Patient experience platform',
      website: 'nexhealth.com',
      summary:
        'Scheduling, messaging, forms, and payments layered on top of practice-management systems.',
      usp: 'Modern patient-facing experiences with deep practice-management integrations.',
      customer: 'Dental, medical, and specialty practices',
      location: 'San Francisco, United States',
      revenue: 'Private company; no reliable public revenue figure found',
      pricing: 'Custom quote',
      moat: 'Integration infrastructure and a polished patient-facing product',
      opportunity:
        'The product focuses on the patient experience more than an internal queue for accountable referral handoffs.',
    },
  ] satisfies ReportCompetitor[],
  competitionResearch: {
    actionId: 'deeper_competition_research',
    title: 'Find the competitors hiding outside the obvious shortlist',
    description:
      'Run a focused competition study across other countries, smaller operators, and narrow workflow products before you choose where to differentiate.',
    includes: [
      'Smaller competitors with early traction',
      'Products succeeding in other countries',
      'Their positioning, moat, pricing, and scale signals',
    ],
    credits: 3,
  },
  demandAndBusiness: {
    demandSignals: [
      {
        label: 'Problem frequency',
        value: 'Encouraging',
        detail: 'The same missed-handoff pattern appears across several clinic roles and channels.',
      },
      {
        label: 'Urgency',
        value: 'Uneven',
        detail:
          'Pain becomes urgent after a visible failure; before that, workarounds feel acceptable.',
      },
      {
        label: 'Willingness to pay',
        value: 'Still unclear',
        detail:
          'Interest is plausible, but public evidence does not establish a dependable price point.',
      },
    ],
    model: {
      buyer: 'Office manager or owner',
      approach: 'Per-location subscription with a small included staff allowance',
      priceLearning: '$79–$149 per location is a useful interview range, not a validated price.',
      retention:
        'Retention could be strong once the workflow holds history and assignments, but only if setup stays light.',
    },
  },
  feasibility: [
    {
      label: 'Focused first product',
      rating: 'Manageable',
      detail:
        'A referral queue, owner, due date, and simple status history are enough for a meaningful prototype.',
    },
    {
      label: 'Clinic integrations',
      rating: 'Hard',
      detail:
        'Deep integrations can dominate scope. The first test should work beside existing systems before connecting to them.',
    },
    {
      label: 'Customer acquisition',
      rating: 'Moderate',
      detail:
        'The target buyer is identifiable, but trust and workflow change make a warm, hands-on sales motion likely at first.',
    },
  ],
  risks: [
    {
      title: 'Clinics agree the problem exists but will not add another tool',
      level: 'High',
      summary: 'The strongest product risk is adoption, not whether missed handoffs happen.',
      whyItMatters:
        'A useful workflow still fails if staff see it as one more place to check during an already busy day.',
      cheapestTest:
        'Run a two-week concierge pilot using a lightweight shared queue before building integrations.',
    },
    {
      title: 'A narrow workflow still requires heavy integration work',
      level: 'High',
      summary: 'The economics weaken quickly if every clinic needs a custom setup.',
      whyItMatters:
        'Implementation cost and support time could exceed what small clinics are willing to pay.',
      cheapestTest:
        'Map the minimum data needed with three clinics and test a no-integration workflow first.',
    },
    {
      title: 'Larger software vendors absorb the feature',
      level: 'Moderate',
      summary:
        'Existing vendors have distribution, but their broad products may leave workflow gaps.',
      whyItMatters:
        'The product needs a narrow advantage that remains valuable even when basic assignment features become common.',
      cheapestTest:
        'Ask buyers what would make them pay for a specialist workflow alongside their existing system.',
    },
  ] satisfies ReportRisk[],
  refinement: {
    current: 'A universal shared inbox for every patient message across independent clinics.',
    recommended:
      'A referral handoff workspace for independent clinics with 6–20 staff, starting as a lightweight layer beside existing systems.',
    changed: [
      'One high-consequence workflow instead of every message type',
      'Office managers as the first buyer',
      'A no-integration pilot before a connected product',
    ],
    retained: [
      'Clear ownership for every follow-up',
      'A shared view for a small clinic team',
      'A calmer alternative to spreadsheets and sticky notes',
    ],
  },
  verdictChangers: {
    improve: [
      'Two clinics complete a pilot and ask to keep using it.',
      'An office manager agrees to pay at least $99 per location.',
      'The workflow works without a custom integration.',
    ],
    weaken: [
      'Staff keep returning to their existing inbox during a pilot.',
      'The buyer expects the practice-management vendor to solve this soon.',
      'Every credible pilot requires a different integration.',
    ],
    unanswered:
      'We could not establish a reliable market-size figure or a validated price from public evidence alone.',
  },
  sources: [
    {
      title: 'Medical practice operations survey',
      publisher: 'MGMA',
      url: 'https://www.mgma.com/',
    },
    {
      title: 'Ambulatory care communication study',
      publisher: 'AHRQ',
      url: 'https://www.ahrq.gov/',
    },
    {
      title: 'Small-practice workflow discussions',
      publisher: 'Public practitioner forums',
      url: 'https://example.com/',
    },
    {
      title: 'Product and pricing pages reviewed',
      publisher: 'Relevant software vendors',
      url: 'https://example.com/',
    },
  ],
  limitations:
    'Public research is useful for understanding patterns and alternatives, but it cannot prove that this exact customer will switch or pay. The most important remaining evidence has to come from a real workflow test.',
} as const;

export type InvestigationReport2Data = typeof investigationReport2;
