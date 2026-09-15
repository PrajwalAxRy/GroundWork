/** @typedef {'active'|'ready'|'locked'|'running'|'complete'|'unread'|'available'|'failed'} StageState */
/** @typedef {{ key: 'shape'|'investigate'|'roadmap', label: string, state: StageState, action: string, note: string }} Stage */
/** @typedef {{ id: string, title: string, brief: string, updated: string, verdict?: { label: string, confidence: string }, notice?: string, stages: Stage[] }} Idea */

/** @type {Idea[]} */
export const ideas = [
  {
    id: 'idea-01',
    title: 'A calmer inbox for independent clinics',
    brief: 'A shared inbox that helps small clinics sort patient requests, assign follow-ups, and keep urgent messages visible without replacing their existing practice software.',
    updated: 'Updated 18 min ago',
    stages: [
      { key: 'shape', label: 'Shape', state: 'active', action: 'Continue shaping', note: 'Clarify who owns triage' },
      { key: 'investigate', label: 'Investigate', state: 'locked', action: 'Locked', note: 'Review the idea first' },
      { key: 'roadmap', label: 'Roadmap', state: 'locked', action: 'Locked', note: 'Complete investigation' },
    ],
  },
  {
    id: 'idea-02',
    title: 'Returns exchange for local fashion labels',
    brief: 'A lightweight exchange network that lets independent clothing brands redirect eligible returns to nearby buyers before shipping items back to a warehouse.',
    updated: 'Updated yesterday',
    notice: 'Ready for your review',
    stages: [
      { key: 'shape', label: 'Shape', state: 'ready', action: 'Review idea', note: 'Brief is ready' },
      { key: 'investigate', label: 'Investigate', state: 'locked', action: 'Locked', note: 'Confirm the brief' },
      { key: 'roadmap', label: 'Roadmap', state: 'locked', action: 'Locked', note: 'Complete investigation' },
    ],
  },
  {
    id: 'idea-03',
    title: 'Field notes for home-energy auditors',
    brief: 'A mobile-first workspace that turns photos and voice notes from residential energy audits into consistent findings and homeowner-ready summaries.',
    updated: 'Updated Sep 8',
    notice: 'Research in progress',
    stages: [
      { key: 'shape', label: 'Shape', state: 'complete', action: 'View transcript', note: 'Idea frozen' },
      { key: 'investigate', label: 'Investigate', state: 'running', action: 'View progress', note: 'Checking claims and sources' },
      { key: 'roadmap', label: 'Roadmap', state: 'locked', action: 'Locked', note: 'Report required' },
    ],
  },
  {
    id: 'idea-04',
    title: 'Refillable cleaning supplies for small offices',
    brief: 'A scheduled refill service for offices that want to reduce single-use plastic without managing dispensers, inventory, or multiple suppliers.',
    updated: 'Updated Sep 5',
    notice: 'New report',
    verdict: { label: 'Test the critical assumption', confidence: 'Moderate confidence' },
    stages: [
      { key: 'shape', label: 'Shape', state: 'complete', action: 'View transcript', note: 'Idea frozen' },
      { key: 'investigate', label: 'Investigate', state: 'unread', action: 'Read report', note: 'Report ready' },
      { key: 'roadmap', label: 'Roadmap', state: 'available', action: 'Build roadmap', note: 'Available next' },
    ],
  },
  {
    id: 'idea-05',
    title: 'Compliance reminders for food-truck operators',
    brief: 'A location-aware calendar that helps multi-city food-truck owners track permit renewals, inspection requirements, and recurring operating deadlines.',
    updated: 'Updated Aug 29',
    notice: 'Credits restored',
    stages: [
      { key: 'shape', label: 'Shape', state: 'complete', action: 'View transcript', note: 'Idea frozen' },
      { key: 'investigate', label: 'Investigate', state: 'failed', action: 'Retry research', note: 'Research could not finish' },
      { key: 'roadmap', label: 'Roadmap', state: 'locked', action: 'Locked', note: 'Report required' },
    ],
  },
]
