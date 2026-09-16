import type { Idea } from '@/lib/contracts/product';

export const ideas: Idea[] = [
  {
    id: 'idea-01',
    title: 'A calmer inbox for independent clinics',
    brief:
      'A shared inbox that helps small clinics sort patient requests, assign follow-ups, and keep urgent messages visible without replacing their existing practice software.',
    updated: 'Updated 18 min ago',
    stages: [
      {
        key: 'shape',
        label: 'Shape',
        state: 'active',
        action: 'Continue shaping',
        note: 'Clarify who owns triage',
      },
      {
        key: 'investigate',
        label: 'Investigate',
        state: 'locked',
        action: 'Locked',
        note: 'Review the idea first',
      },
      {
        key: 'roadmap',
        label: 'Roadmap',
        state: 'locked',
        action: 'Locked',
        note: 'Complete investigation',
      },
    ],
  },
  {
    id: 'idea-02',
    title: 'Returns exchange for local fashion labels',
    brief:
      'A lightweight exchange network that lets independent clothing brands redirect eligible returns to nearby buyers before shipping items back to a warehouse.',
    updated: 'Updated yesterday',
    notice: 'Ready for your review',
    stages: [
      {
        key: 'shape',
        label: 'Shape',
        state: 'ready',
        action: 'Review idea',
        note: 'Brief is ready',
      },
      {
        key: 'investigate',
        label: 'Investigate',
        state: 'locked',
        action: 'Locked',
        note: 'Confirm the brief',
      },
      {
        key: 'roadmap',
        label: 'Roadmap',
        state: 'locked',
        action: 'Locked',
        note: 'Complete investigation',
      },
    ],
  },
  {
    id: 'idea-03',
    title: 'Field notes for home-energy auditors',
    brief:
      'A mobile-first workspace that turns photos and voice notes from residential energy audits into consistent findings and homeowner-ready summaries.',
    updated: 'Updated Sep 8',
    stages: [
      {
        key: 'shape',
        label: 'Shape',
        state: 'complete',
        action: 'View transcript',
        note: 'Idea frozen',
      },
      {
        key: 'investigate',
        label: 'Investigate',
        state: 'complete',
        action: 'Open investigation',
        note: 'Report available',
      },
      {
        key: 'roadmap',
        label: 'Roadmap',
        state: 'complete',
        action: 'View roadmap',
        note: 'Roadmap available',
      },
    ],
  },
  {
    id: 'idea-04',
    title: 'Refillable cleaning supplies for small offices',
    brief:
      'A scheduled refill service for offices that want to reduce single-use plastic without managing dispensers, inventory, or multiple suppliers.',
    updated: 'Updated Sep 5',
    verdict: { label: 'Test the critical assumption', confidence: 'Moderate confidence' },
    stages: [
      {
        key: 'shape',
        label: 'Shape',
        state: 'complete',
        action: 'View transcript',
        note: 'Idea frozen',
      },
      {
        key: 'investigate',
        label: 'Investigate',
        state: 'complete',
        action: 'Open investigation',
        note: 'Report available',
      },
      {
        key: 'roadmap',
        label: 'Roadmap',
        state: 'complete',
        action: 'View roadmap',
        note: 'Roadmap available',
      },
    ],
  },
  {
    id: 'idea-05',
    title: 'Compliance reminders for food-truck operators',
    brief:
      'A location-aware calendar that helps multi-city food-truck owners track permit renewals, inspection requirements, and recurring operating deadlines.',
    updated: 'Updated Aug 29',
    stages: [
      {
        key: 'shape',
        label: 'Shape',
        state: 'complete',
        action: 'View transcript',
        note: 'Idea frozen',
      },
      {
        key: 'investigate',
        label: 'Investigate',
        state: 'complete',
        action: 'Open investigation',
        note: 'Report available',
      },
      {
        key: 'roadmap',
        label: 'Roadmap',
        state: 'complete',
        action: 'View roadmap',
        note: 'Roadmap available',
      },
    ],
  },
];
