export type VerdictLabel =
  | 'Worth pursuing'
  | 'Refine before pursuing'
  | 'Test the critical assumption'
  | 'Major obstacles'
  | 'Reconsider this version';

export type SectionStatus = 'complete' | 'partial' | 'insufficient_evidence' | 'not_applicable';

export type Competitor = {
  name: string;
  website?: string;
  description: string;
  targetCustomer?: string;
  pricing?: string;
  traction?: string;
  strength: string;
  gap: string;
};

export type FeasibilityRow = {
  dimension: string;
  rating: 'Low' | 'Moderate' | 'High';
  reasoning: string;
};

export type RiskItem = {
  title: string;
  impact: 'Low' | 'Moderate' | 'High';
  evidenceStrength: 'Weak' | 'Moderate' | 'Strong';
  whyItMatters: string;
  cheapestTest: string;
  blocksBuilding: boolean;
};

export type Source = {
  title: string;
  publisher: string;
  url: string;
  section: string;
};

export type FollowUpAction = {
  id: string;
  label: string;
  description: string;
  credits: number;
  primary?: boolean;
};

export const investigationReport = {
  ideaId: 'idea-01',
  ideaTitle: 'A calmer inbox for independent clinics',
  researchDate: '16 September 2026',
  geography: 'United States',
  shapeTranscriptHref: '/idea/shape/idea-01',

  verdict: 'Refine before pursuing' as VerdictLabel,
  confidence: 'Moderate confidence',
  verdictReasoning:
    'Small clinics clearly struggle with fragmented patient messages, and staff are actively duct-taping shared inboxes and spreadsheets to cope. But the strongest evidence points to a narrower starting wedge than the current idea describes, and pricing sensitivity among the smallest practices is a real constraint.',

  strongestReasons: [
    'Front-desk staff at independent clinics consistently describe message triage as their most stressful daily task, with several already paying for partial workarounds.',
    'Existing practice-management software treats messaging as an afterthought, leaving a clear functional gap rather than a crowded feature war.',
    'The buying group (office managers, not clinicians) is reachable through associations and peer networks already used for other software decisions.',
  ],
  strongestConcern:
    'Clinics with fewer than five staff show meaningfully lower willingness to pay, and they represent a large share of the addressable market — the current pricing assumption may not clear that segment.',

  recommendedVersion: {
    summary:
      'Focus first on clinics with six or more staff, where message volume is high enough to justify a paid tool, and position around urgent-message triage rather than general inbox replacement.',
    changed: [
      'Narrowed target segment from "independent clinics" to practices with 6+ staff and multi-provider scheduling.',
      'Repositioned around urgent-message triage as the wedge, not full inbox replacement.',
    ],
    retained: [
      'Core idea of a shared, assignable inbox that layers on top of existing practice software.',
      'Non-replacement approach — the product does not compete with EHR or scheduling systems.',
    ],
  },

  bestNextAction: {
    label: 'Build my Roadmap',
    description:
      'See a milestone-level path for testing the narrowed version and reaching a first paying clinic.',
  },

  evidenceCoverage: {
    complete: 8,
    partial: 1,
    insufficientEvidence: 0,
    notApplicable: 1,
    total: 10,
  },

  sections: {
    decisionDrivers: {
      status: 'complete' as SectionStatus,
      encouraging: [
        'Staff describe message triage as a daily source of stress and missed follow-ups.',
        'Several clinics already pay for informal workarounds like shared email accounts or paid spreadsheet plugins.',
        'Buying decisions for small software tools are made locally by office managers, not corporate IT.',
      ],
      caution: [
        'Practices under six staff show weaker willingness to pay in every interview and survey signal found.',
        'Switching costs are low, so retention will depend on daily habit formation, not lock-in.',
      ],
      strongestArgumentAgainst:
        'If the smallest clinics — the largest share of the market by count — will not pay a meaningful price, the addressable market for a standalone paid tool may be smaller than it first appears.',
      couldImprove:
        'A signed pilot agreement from a 6+ staff clinic willing to pay list price would substantially strengthen this verdict.',
      couldWeaken:
        'Evidence that larger practice-management vendors are shipping comparable triage features within the next year would weaken the opportunity.',
    },

    customerEvidence: {
      status: 'complete' as SectionStatus,
      segments: [
        'Independent clinics with 6–20 staff and multiple providers',
        'Multi-location small practice groups (2–4 locations)',
        'Solo and small practices under 6 staff',
      ],
      recommendedSegment: 'Independent clinics with 6–20 staff and multiple providers',
      problem:
        'Patient messages arrive across phone, fax, patient portal, and walk-ins, and get triaged manually by whoever is at the front desk. Urgent messages are sometimes missed for hours during busy periods.',
      buyingTrigger:
        'A missed or delayed urgent message that caused a real complaint or safety concern is the most common trigger cited for shopping for a new tool.',
      alternatives: [
        'Shared email inbox',
        'Paper message slips',
        'Practice-management software add-on modules',
        'Sticky notes and verbal handoffs',
      ],
      supportingEvidence:
        'Interviews and public forum discussions from office managers consistently describe the same triage failure pattern, independent of geography.',
      uncertainties:
        'It is unclear how much of this pain is already being solved by newer all-in-one practice-management suites that some clinics are migrating toward.',
    },

    competitiveLandscape: {
      status: 'complete' as SectionStatus,
      competitors: [
        {
          name: 'Weave',
          website: 'getweave.com',
          description:
            'Communication platform for small healthcare and dental practices, including calling and texting.',
          targetCustomer: 'Dental and small medical practices',
          pricing: 'From $299/month, bundled with phone system',
          traction: 'Reports serving over 25,000 practice locations',
          strength: 'Deep integration with phone systems already used by clinics',
          gap: 'Broad platform, not focused specifically on message triage and urgency',
        },
        {
          name: 'Klara',
          website: 'klara.com',
          description:
            'Patient communication and messaging platform used by mid-size and larger practice groups.',
          targetCustomer: 'Multi-provider and multi-location practice groups',
          pricing: 'Custom pricing, typically enterprise-tier',
          strength: 'Established relationships with larger practice groups',
          gap: 'Pricing and onboarding are built for larger organizations, not the smallest independent clinics',
        },
        {
          name: 'Shared email + spreadsheet workflow',
          description:
            'The informal status quo most small clinics currently use to triage patient messages.',
          strength: 'Free or near-free, no new tool to learn',
          gap: 'No urgency flagging, no assignment, and messages are easy to lose track of during busy periods',
        },
      ] as Competitor[],
    },

    demandSignals: {
      status: 'partial' as SectionStatus,
      signals: [
        'Recurring complaints about missed patient messages appear across independent-practice forums and association discussion boards.',
        'Several regional practice-management consultants cite "inbox chaos" as a top-three complaint from clinics they advise.',
      ],
      trends: [
        'Continued consolidation of smaller practices into larger groups may shift the buyer from independent owners to group administrators over the next few years.',
      ],
      spendingBehavior:
        'Clinics already spend on point communication tools like patient-reminder texting, suggesting some budget exists for adjacent communication software.',
      marketSizeAvailable: false,
      limitation:
        'A credible market-size estimate could not be established. Public data on independent-clinic software spend is fragmented and inconsistent across sources.',
    },

    businessModel: {
      status: 'complete' as SectionStatus,
      buyer: 'Office manager or practice owner',
      user: 'Front-desk and clinical support staff',
      monetizationModels: [
        'Flat monthly subscription per location',
        'Per-seat pricing for larger multi-provider practices',
      ],
      comparablePricing:
        'Verified adjacent tools price between $100 and $300 per month for small-practice communication software.',
      costConsiderations:
        'Primary ongoing cost is customer support during onboarding, since staff have low tolerance for workflow disruption.',
      retentionCharacteristics:
        'Daily-use tools embedded in front-desk workflow tend to have strong retention once adopted, but the first 30 days of habit formation are the highest-risk period.',
      mostPlausibleModel:
        'Flat monthly subscription per location, priced below existing bundled communication suites, positioned as an add-on rather than a replacement.',
    },

    feasibility: {
      status: 'complete' as SectionStatus,
      playbook: 'SaaS',
      rows: [
        {
          dimension: 'Product scope',
          rating: 'Low',
          reasoning:
            'A focused inbox and triage tool has a small, well-understood core feature set.',
        },
        {
          dimension: 'Technical complexity',
          rating: 'Low',
          reasoning: 'Message ingestion and assignment workflows are well-established patterns.',
        },
        {
          dimension: 'Data availability',
          rating: 'Moderate',
          reasoning: 'Depends on integrating with fax and phone systems that vary by clinic.',
        },
        {
          dimension: 'Integrations',
          rating: 'Moderate',
          reasoning:
            'No dominant practice-management API standard, so some integrations will be manual.',
        },
        {
          dimension: 'Customer acquisition',
          rating: 'Moderate',
          reasoning:
            'Reachable through associations and peer referrals, but sales cycles involve in-person trust building.',
        },
        {
          dimension: 'Defensibility',
          rating: 'Low',
          reasoning:
            'Little technical moat; defensibility would need to come from workflow habit and account depth over time.',
        },
      ] as FeasibilityRow[],
    },

    risks: {
      status: 'complete' as SectionStatus,
      items: [
        {
          title: 'Smallest clinics may not pay a sustainable price',
          impact: 'High',
          evidenceStrength: 'Strong',
          whyItMatters:
            'This segment is the largest share of the market by count, and weak willingness to pay there caps achievable revenue per account.',
          cheapestTest:
            'Offer a paid pilot at list price to five sub-6-staff clinics and measure conversion after the trial.',
          blocksBuilding: false,
        },
        {
          title: 'Larger communication suites could add triage features',
          impact: 'Moderate',
          evidenceStrength: 'Moderate',
          whyItMatters:
            'An incumbent shipping a comparable feature would remove the differentiation this idea depends on.',
          cheapestTest:
            'Monitor release notes and sales materials from Weave and Klara over the next two quarters.',
          blocksBuilding: false,
        },
        {
          title: 'Integration effort with fax and phone systems could be underestimated',
          impact: 'Moderate',
          evidenceStrength: 'Weak',
          whyItMatters:
            'If integration work is heavier than expected, onboarding time and support cost could erode margins.',
          cheapestTest:
            'Scope integration work with three target clinics before committing to a build timeline.',
          blocksBuilding: true,
        },
      ] as RiskItem[],
    },

    refinement: {
      status: 'complete' as SectionStatus,
      current: {
        label: 'Current idea',
        description:
          'A shared inbox for independent clinics of any size to sort and assign patient messages.',
      },
      recommended: {
        label: 'Recommended version',
        description:
          'An urgent-message triage tool for clinics with 6+ staff and multiple providers, layered on top of existing practice software.',
      },
    },

    verdictChangers: {
      status: 'complete' as SectionStatus,
      wouldImprove: [
        'A signed pilot agreement from a 6+ staff clinic at list price',
        'Evidence that onboarding can be completed without heavy custom integration work',
      ],
      wouldWeaken: [
        'A major practice-management vendor announcing a comparable triage feature',
        'Consistent unwillingness to pay from the 6+ staff segment as well',
      ],
      openQuestions: [
        'How much integration work do fax and phone systems actually require across common clinic setups?',
        'Would practices prefer a per-seat or flat-location price at this stage?',
      ],
      realWorldActions: [
        'Run a small paid pilot with two or three target clinics before further investment.',
        'Validate integration scope directly with a practice-management consultant.',
      ],
    },

    optionalSection: {
      status: 'complete' as SectionStatus,
      title: 'Regulatory considerations',
      body: 'Handling patient messages may bring the product into scope for HIPAA-aligned data handling, depending on message content. This is a standard, well-understood compliance path for healthcare software and does not appear to be a blocking obstacle, but it should be scoped before committing to an architecture.',
    },

    limitations:
      'This research relied on public forum discussions, association materials, and adjacent-product pricing pages rather than direct clinic financial records. Findings on willingness to pay are directional, not verified transaction data.',
  },

  sources: [
    {
      title: 'Independent practice association discussion archive',
      publisher: 'napm-assn.org',
      url: 'https://example.com/source-1',
      section: 'Customer and problem evidence',
    },
    {
      title: 'Weave pricing and product overview',
      publisher: 'getweave.com',
      url: 'https://example.com/source-2',
      section: 'Competitive landscape',
    },
    {
      title: 'Klara platform overview',
      publisher: 'klara.com',
      url: 'https://example.com/source-3',
      section: 'Competitive landscape',
    },
    {
      title: 'Small practice communication spend survey summary',
      publisher: 'practicegrowth.report',
      url: 'https://example.com/source-4',
      section: 'Demand and market signals',
    },
    {
      title: 'Practice-management consultant interview notes',
      publisher: 'Groundwork research',
      url: 'https://example.com/source-5',
      section: 'Business model',
    },
    {
      title: 'HIPAA compliance overview for small practice software',
      publisher: 'hhs.gov',
      url: 'https://example.com/source-6',
      section: 'Regulatory considerations',
    },
  ] as Source[],

  followUpActions: [
    {
      id: 'roadmap',
      label: 'Build my Roadmap',
      description: 'Get a milestone-level path for testing the narrowed version.',
      credits: 3,
      primary: true,
    },
    {
      id: 'new-segment',
      label: 'Investigate the recommended version',
      description: 'Start a fresh Investigation scoped to the narrowed segment as a new Idea.',
      credits: 5,
    },
    {
      id: 'pricing-analysis',
      label: 'Deeper pricing and demand analysis',
      description: 'Go deeper on willingness to pay across practice sizes.',
      credits: 2,
    },
  ] as FollowUpAction[],
};

export type InvestigationReportData = typeof investigationReport;
