export type ReportRisk = {
  title: string;
  level: 'Moderate' | 'High';
  summary: string;
  whyItMatters: string;
  cheapestTest: string;
};

export type ReportAlternative = {
  name: string;
  kind: string;
  whyChosen: string;
  opening: string;
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
  alternatives: [
    {
      name: 'Practice-management inboxes',
      kind: 'Built-in software',
      whyChosen: 'Already paid for and connected to patient records.',
      opening: 'Often designed for receiving messages, not coordinating a handoff across staff.',
    },
    {
      name: 'Secure messaging tools',
      kind: 'Direct alternative',
      whyChosen: 'Familiar conversations and faster staff communication.',
      opening: 'Threads can become another place to search, with ownership still left implicit.',
    },
    {
      name: 'Spreadsheets and paper notes',
      kind: 'Status quo',
      whyChosen: 'Flexible, cheap, and requires no rollout.',
      opening: 'No reliable reminder, audit trail, or shared view of what is overdue.',
    },
  ] satisfies ReportAlternative[],
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
