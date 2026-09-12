/**
 * @typedef {'shape' | 'investigate' | 'roadmap'} StageKey
 * @typedef {'current' | 'completed' | 'available' | 'running' | 'ready' | 'locked' | 'failed'} StageState
 *
 * @typedef {Object} IdeaStage
 * @property {StageKey} key
 * @property {string} name
 * @property {StageState} state
 * @property {string} action
 * @property {string} detail
 *
 * @typedef {Object} IdeaVerdict
 * @property {'Worth pursuing' | 'Refine before pursuing' | 'Test the critical assumption' | 'Major obstacles' | 'Reconsider this version'} label
 * @property {'Low confidence' | 'Moderate confidence' | 'High confidence'} confidence
 *
 * @typedef {Object} IdeaRecord
 * @property {string} id
 * @property {string=} title
 * @property {string=} brief
 * @property {string=} firstMessage
 * @property {string} updatedAt
 * @property {string} updatedLabel
 * @property {string} positionLabel
 * @property {boolean} unread
 * @property {IdeaVerdict=} verdict
 * @property {IdeaStage[]} stages
 */

/** @type {IdeaRecord[]} */
const ideas = [
  {
    id: 'hardware-stock',
    brief:
      'A lightweight way for nearby hardware shops to share stock visibility and keep a sale when an item is unavailable.',
    firstMessage: 'Shared inventory for independent hardware shops',
    updatedAt: '2026-09-12T16:12:00+05:30',
    updatedLabel: 'Updated 18 minutes ago',
    positionLabel: 'Shaping',
    unread: false,
    stages: [
      { key: 'shape', name: 'Shape', state: 'current', action: 'Continue shaping', detail: 'Clarify the buyer' },
      { key: 'investigate', name: 'Investigate', state: 'locked', action: 'Investigation locked', detail: 'Review your idea first' },
      { key: 'roadmap', name: 'Roadmap', state: 'locked', action: 'Roadmap locked', detail: 'Complete investigation first' },
    ],
  },
  {
    id: 'studio-bookings',
    title: 'Last-minute booking exchange for photo studios',
    brief:
      'A private exchange where independent studios can offer cancelled slots to trusted photographers without public discounting.',
    firstMessage: 'Photo studios need a private way to offer cancelled slots.',
    updatedAt: '2026-09-11T17:20:00+05:30',
    updatedLabel: 'Updated yesterday',
    positionLabel: 'Ready to review',
    unread: false,
    stages: [
      { key: 'shape', name: 'Shape', state: 'current', action: 'Review idea', detail: 'Brief is ready' },
      { key: 'investigate', name: 'Investigate', state: 'locked', action: 'Investigation locked', detail: 'Confirm the brief first' },
      { key: 'roadmap', name: 'Roadmap', state: 'locked', action: 'Roadmap locked', detail: 'Complete investigation first' },
    ],
  },
  {
    id: 'school-suppliers',
    title: 'Supplier due diligence for small school trusts',
    brief:
      'A guided evidence pack that helps small school trusts compare unfamiliar suppliers before a high-consideration purchase.',
    firstMessage: 'Small school trusts struggle to check unfamiliar suppliers before buying.',
    updatedAt: '2026-09-12T15:48:00+05:30',
    updatedLabel: 'Research started 42 minutes ago',
    positionLabel: 'Researching',
    unread: false,
    stages: [
      { key: 'shape', name: 'Shape', state: 'completed', action: 'View shaped idea', detail: 'Frozen for this version' },
      { key: 'investigate', name: 'Investigate', state: 'running', action: 'View research progress', detail: 'Mapping alternatives' },
      { key: 'roadmap', name: 'Roadmap', state: 'locked', action: 'Roadmap locked', detail: 'Research is in progress' },
    ],
  },
  {
    id: 'grant-reporting',
    title: 'Outcome reporting for local arts grants',
    brief:
      'A reporting workspace for small arts organisations that need to turn project notes into credible funder updates.',
    firstMessage: 'Help small arts groups turn project notes into funder reports.',
    updatedAt: '2026-09-12T13:05:00+05:30',
    updatedLabel: 'Research completed today',
    positionLabel: 'Report ready',
    unread: true,
    verdict: { label: 'Test the critical assumption', confidence: 'Moderate confidence' },
    stages: [
      { key: 'shape', name: 'Shape', state: 'completed', action: 'View shaped idea', detail: 'Read-only transcript' },
      { key: 'investigate', name: 'Investigate', state: 'ready', action: 'Report ready', detail: 'New research to read' },
      { key: 'roadmap', name: 'Roadmap', state: 'available', action: 'Build roadmap', detail: 'Available after research' },
    ],
  },
  {
    id: 'commercial-kitchens',
    title: 'Shared compliance records for commercial kitchens',
    brief:
      'A simple record layer for independent food businesses sharing prep space, equipment checks, and inspection evidence.',
    firstMessage: 'Shared kitchens need one place for equipment checks and inspection evidence.',
    updatedAt: '2026-09-09T11:40:00+05:30',
    updatedLabel: 'Brief confirmed 3 days ago',
    positionLabel: 'Ready to investigate',
    unread: false,
    stages: [
      { key: 'shape', name: 'Shape', state: 'completed', action: 'Review idea', detail: 'Brief confirmed' },
      { key: 'investigate', name: 'Investigate', state: 'available', action: 'Start investigation', detail: 'Credit confirmation next' },
      { key: 'roadmap', name: 'Roadmap', state: 'locked', action: 'Roadmap locked', detail: 'Complete investigation first' },
    ],
  },
  {
    id: 'museum-guides',
    title: 'Adaptive visit guides for small museums',
    brief:
      'A low-maintenance guide builder for museums that want to offer different visit routes without commissioning a custom app.',
    firstMessage: 'Small museums need adaptable visit guides without maintaining an app.',
    updatedAt: '2026-09-05T09:15:00+05:30',
    updatedLabel: 'Roadmap completed last week',
    positionLabel: 'Roadmap ready',
    unread: false,
    verdict: { label: 'Worth pursuing', confidence: 'Moderate confidence' },
    stages: [
      { key: 'shape', name: 'Shape', state: 'completed', action: 'View shaped idea', detail: 'Read-only transcript' },
      { key: 'investigate', name: 'Investigate', state: 'completed', action: 'Open investigation', detail: 'Research reviewed' },
      { key: 'roadmap', name: 'Roadmap', state: 'completed', action: 'Open roadmap', detail: 'Ready to revisit' },
    ],
  },
  {
    id: 'repair-intake',
    title: 'Repair intake for volunteer-run housing co-ops',
    brief:
      'A request intake layer that helps volunteer housing teams identify urgent repairs and route them to the right person.',
    firstMessage: 'Volunteer housing teams need a better way to triage repair requests.',
    updatedAt: '2026-09-10T14:30:00+05:30',
    updatedLabel: 'Research stopped 2 days ago',
    positionLabel: 'Research needs attention',
    unread: false,
    stages: [
      { key: 'shape', name: 'Shape', state: 'completed', action: 'View shaped idea', detail: 'Read-only transcript' },
      { key: 'investigate', name: 'Investigate', state: 'failed', action: 'Retry research', detail: 'Credits were restored' },
      { key: 'roadmap', name: 'Roadmap', state: 'locked', action: 'Roadmap locked', detail: 'Research did not complete' },
    ],
  },
]

/** @param {IdeaRecord} idea @returns {IdeaRecord & {title: string, brief: string}} */
function normalizeIdea(idea) {
  const firstMessage = String(idea.firstMessage || '').trim()
  const title = String(idea.title || '').trim() || firstMessage || 'Untitled idea'
  const brief = String(idea.brief || '').trim() || firstMessage || 'The idea brief is still being prepared.'
  return { ...idea, title, brief }
}

export const ideaService = {
  /** @returns {Promise<IdeaRecord[]>} */
  async listIdeas() {
    return structuredClone(ideas)
      .map(normalizeIdea)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  },

  /** @param {string} thought @returns {IdeaRecord} */
  createDraft(thought) {
    const firstLine = thought.split(/\r?\n/).find(Boolean)?.trim() || thought.trim()
    const title = firstLine.length > 72 ? `${firstLine.slice(0, 69).trim()}…` : firstLine

    return {
      id: `draft-${Date.now()}`,
      title,
      brief: thought.trim(),
      firstMessage: thought.trim(),
      updatedAt: new Date().toISOString(),
      updatedLabel: 'Created just now',
      positionLabel: 'Shaping',
      unread: false,
      stages: [
        { key: 'shape', name: 'Shape', state: 'current', action: 'Continue shaping', detail: 'New idea' },
        { key: 'investigate', name: 'Investigate', state: 'locked', action: 'Investigation locked', detail: 'Review your idea first' },
        { key: 'roadmap', name: 'Roadmap', state: 'locked', action: 'Roadmap locked', detail: 'Complete investigation first' },
      ],
    }
  },
}
