/**
 * Replace this module with the Ideas service when the prototype gains a backend.
 * The renderer only receives known stage states and optional presentation fields.
 */
const ideaRecords = [
  {
    id: 'mentor-match',
    title: 'Practice-based mentor matching for first-time managers',
    summary: 'A focused way for new managers to find a peer mentor for the difficult first six months, before problems become team turnover.',
    updated: 'Edited 18 minutes ago',
    stages: [
      { name: 'Shape', state: 'current', action: 'Continue shaping', detail: 'One question waiting' },
      { name: 'Investigate', state: 'locked', action: 'Research is locked', detail: 'Review the brief first' },
      { name: 'Roadmap', state: 'locked', action: 'Roadmap is locked', detail: 'Complete research first' },
    ],
  },
  {
    id: 'clinic-callbacks',
    title: 'A calmer callback queue for independent clinics',
    summary: 'A shared follow-up queue for small clinics that need to surface patient concerns without adding another front-desk system.',
    updated: 'Brief is ready to review',
    stages: [
      { name: 'Shape', state: 'complete', action: 'Review idea', detail: 'Brief ready' },
      { name: 'Investigate', state: 'locked', action: 'Research is locked', detail: 'Confirm the brief first' },
      { name: 'Roadmap', state: 'locked', action: 'Roadmap is locked', detail: 'Complete research first' },
    ],
  },
  {
    id: 'builders-logbook',
    title: 'Site logbooks for small building teams',
    summary: 'A simple photo and note trail for subcontractors who need evidence of on-site changes without chasing messages after a job.',
    updated: 'Research is in progress',
    stages: [
      { name: 'Shape', state: 'complete', action: 'View shaped idea', detail: 'Brief frozen' },
      { name: 'Investigate', state: 'running', action: 'View research progress', detail: 'Checking alternatives' },
      { name: 'Roadmap', state: 'locked', action: 'Roadmap is locked', detail: 'Research is running' },
    ],
  },
  {
    id: 'tenancy-renewal',
    title: 'Renewal planning for small landlords',
    summary: 'A plain-language planning tool for independent landlords and tenants who need to prepare for a renewal without losing track of decisions.',
    updated: 'Report ready today',
    verdict: { label: 'Test the critical assumption', confidence: 'Moderate confidence' },
    stages: [
      { name: 'Shape', state: 'complete', action: 'View shaped idea', detail: 'Brief frozen' },
      { name: 'Investigate', state: 'ready', action: 'Read report', detail: 'New evidence is ready' },
      { name: 'Roadmap', state: 'available', action: 'Build roadmap', detail: 'Available after the report' },
    ],
  },
  {
    id: 'meal-changes',
    title: 'Late-order changes for meal subscriptions',
    summary: 'A service layer for meal subscription teams handling last-minute customer changes without creating avoidable kitchen work.',
    updated: 'Roadmap completed yesterday',
    verdict: { label: 'Worth pursuing', confidence: 'Moderate confidence' },
    stages: [
      { name: 'Shape', state: 'complete', action: 'View shaped idea', detail: 'Brief frozen' },
      { name: 'Investigate', state: 'complete', action: 'Open investigation', detail: 'Report reviewed' },
      { name: 'Roadmap', state: 'complete', action: 'Open roadmap', detail: 'Ready to revisit' },
    ],
  },
  {
    id: 'repair-routing',
    title: 'Repair requests for housing co-ops',
    summary: 'A structured intake for volunteer-run co-ops that need to identify urgent repairs quickly and route them with less back-and-forth.',
    updated: 'Research needs attention',
    stages: [
      { name: 'Shape', state: 'complete', action: 'View shaped idea', detail: 'Brief frozen' },
      { name: 'Investigate', state: 'failed', action: 'Retry research', detail: 'Credits were restored' },
      { name: 'Roadmap', state: 'locked', action: 'Roadmap is locked', detail: 'Research did not complete' },
    ],
  },
]

export function getIdeas() {
  return structuredClone(ideaRecords)
}
