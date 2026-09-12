/**
 * @typedef {'shape' | 'investigate' | 'roadmap'} StageKey
 * @typedef {'current' | 'review' | 'complete' | 'running' | 'unread' | 'available' | 'locked' | 'failed'} StageState
 *
 * @typedef {Readonly<{
 *   key: StageKey,
 *   name: string,
 *   state: StageState,
 *   status: string,
 *   action: string,
 *   detail?: string,
 *   disabled?: boolean
 * }>} IdeaStage
 *
 * @typedef {Readonly<{
 *   label: 'Worth pursuing' | 'Refine before pursuing' | 'Test the critical assumption' | 'Major obstacles' | 'Reconsider this version',
 *   confidence: 'Low confidence' | 'Moderate confidence' | 'High confidence'
 * }>} IdeaVerdict
 *
 * @typedef {Readonly<{
 *   schemaVersion: '1.0',
 *   id: string,
 *   title: string,
 *   brief: string,
 *   updatedLabel: string,
 *   isFrozen: boolean,
 *   verdict?: IdeaVerdict,
 *   notice?: string,
 *   stages: readonly IdeaStage[]
 * }>} IdeaDashboardItem
 */

const stage = (key, name, state, status, action, options = {}) =>
  Object.freeze({ key, name, state, status, action, ...options })

const freezeIdea = (idea) =>
  Object.freeze({
    ...idea,
    verdict: idea.verdict ? Object.freeze(idea.verdict) : undefined,
    stages: Object.freeze(idea.stages),
  })

/** @type {readonly IdeaDashboardItem[]} */
const populatedIdeas = Object.freeze([
  freezeIdea({
    schemaVersion: '1.0',
    id: 'feedback-inbox',
    title: 'Privacy-first client feedback inbox',
    brief:
      'A lightweight inbox that turns scattered client comments into clear themes for independent product studios.',
    updatedLabel: 'Updated 18 minutes ago',
    isFrozen: false,
    stages: [
      stage('shape', 'Shape', 'current', 'In progress', 'Continue shaping'),
      stage('investigate', 'Investigate', 'locked', 'Locked', 'Finish Shape first', {
        disabled: true,
        detail: 'Review the idea before starting research.',
      }),
      stage('roadmap', 'Roadmap', 'locked', 'Locked', 'Research required', {
        disabled: true,
        detail: 'Complete an Investigation to unlock the Roadmap.',
      }),
    ],
  }),
  freezeIdea({
    schemaVersion: '1.0',
    id: 'care-roster',
    title: 'Roster gap exchange for care teams',
    brief:
      'A verified shift exchange for small care providers that need to cover last-minute absences without agency fees.',
    updatedLabel: 'Updated yesterday',
    isFrozen: false,
    stages: [
      stage('shape', 'Shape', 'review', 'Ready to review', 'Review idea'),
      stage('investigate', 'Investigate', 'locked', 'Locked', 'Review Shape first', {
        disabled: true,
        detail: 'Confirm the Idea Brief before starting research.',
      }),
      stage('roadmap', 'Roadmap', 'locked', 'Locked', 'Research required', {
        disabled: true,
        detail: 'Complete an Investigation to unlock the Roadmap.',
      }),
    ],
  }),
  freezeIdea({
    schemaVersion: '1.0',
    id: 'cafe-planner',
    title: 'Independent café demand planner',
    brief:
      'A daily prep planner that helps owner-operated cafés reduce food waste using their sales and local event patterns.',
    updatedLabel: 'Updated 2 days ago',
    isFrozen: true,
    notice: 'Mapping competitors and alternatives',
    stages: [
      stage('shape', 'Shape', 'complete', 'Complete', 'View shaping'),
      stage('investigate', 'Investigate', 'running', 'Research in progress', 'View research progress'),
      stage('roadmap', 'Roadmap', 'locked', 'Locked', 'Waiting for research', {
        disabled: true,
        detail: 'The Roadmap unlocks when the report is ready.',
      }),
    ],
  }),
  freezeIdea({
    schemaVersion: '1.0',
    id: 'invoice-follow-up',
    title: 'Invoice follow-up for small studios',
    brief:
      'A tactful collections assistant for creative studios that tracks promises, nudges clients, and protects relationships.',
    updatedLabel: 'Updated 5 days ago',
    isFrozen: true,
    verdict: {
      label: 'Worth pursuing',
      confidence: 'Moderate confidence',
    },
    stages: [
      stage('shape', 'Shape', 'complete', 'Complete', 'View shaping'),
      stage('investigate', 'Investigate', 'unread', 'New report', 'Read report'),
      stage('roadmap', 'Roadmap', 'available', 'Available', 'Build roadmap'),
    ],
  }),
  freezeIdea({
    schemaVersion: '1.0',
    id: 'popup-returns',
    title: 'Pop-up retail returns network',
    brief:
      'Shared neighborhood return points for online brands that run temporary shops and lack permanent local operations.',
    updatedLabel: 'Updated 12 days ago',
    isFrozen: true,
    verdict: {
      label: 'Refine before pursuing',
      confidence: 'High confidence',
    },
    stages: [
      stage('shape', 'Shape', 'complete', 'Complete', 'View shaping'),
      stage('investigate', 'Investigate', 'complete', 'Complete', 'Open investigation'),
      stage('roadmap', 'Roadmap', 'complete', 'Complete', 'Open roadmap'),
    ],
  }),
  freezeIdea({
    schemaVersion: '1.0',
    id: 'permit-companion',
    title: 'Permit companion for home renovators',
    brief:
      'A plain-language guide that helps first-time renovators understand the permit path for a specific project.',
    updatedLabel: 'Updated 3 weeks ago',
    isFrozen: true,
    notice: 'Research stopped. Your reserved credits were restored.',
    stages: [
      stage('shape', 'Shape', 'complete', 'Complete', 'View shaping'),
      stage('investigate', 'Investigate', 'failed', 'Research failed', 'Retry research', {
        detail: 'No credits were charged.',
      }),
      stage('roadmap', 'Roadmap', 'locked', 'Locked', 'Research required', {
        disabled: true,
        detail: 'Complete an Investigation to unlock the Roadmap.',
      }),
    ],
  }),
])

const creditSummary = Object.freeze({ label: 'Credits', balance: 24 })

/**
 * Replaceable dashboard data boundary for the experiment.
 * @param {{ view?: 'populated' | 'empty' | 'loading' | 'error' }} [options]
 */
export async function getIdeasDashboard(options = {}) {
  const view = options.view ?? 'populated'

  if (view === 'loading') {
    return Object.freeze({ status: 'loading', credits: creditSummary, ideas: Object.freeze([]) })
  }

  if (view === 'error') {
    return Object.freeze({
      status: 'error',
      credits: creditSummary,
      ideas: Object.freeze([]),
      message: 'Your ideas could not be loaded. Your work is still safe.',
    })
  }

  return Object.freeze({
    status: 'ready',
    credits: creditSummary,
    ideas: view === 'empty' ? Object.freeze([]) : populatedIdeas,
  })
}
