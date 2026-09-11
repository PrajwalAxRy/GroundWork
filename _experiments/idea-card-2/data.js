/** @typedef {'editable'|'review'|'frozen'} ShapeState */
/** @typedef {'locked'|'available'|'running'|'ready'|'complete'|'failed'} InvestigationState */
/** @typedef {'locked'|'available'|'running'|'complete'|'failed'} RoadmapState */

/**
 * @typedef {Object} Idea
 * @property {string} id
 * @property {string} title
 * @property {string} brief
 * @property {string} updated
 * @property {ShapeState} shape
 * @property {InvestigationState} investigation
 * @property {RoadmapState} roadmap
 * @property {{label: string, confidence: string}|undefined} verdict
 * @property {boolean} frozen
 */

/** @type {Idea[]} */
const mockIdeas = [
  {
    id: 'invoice-follow-up',
    title: 'Invoice follow-up for solo consultants',
    brief: 'A calm follow-up workspace that helps independent consultants collect late invoices without damaging client relationships.',
    updated: 'Updated 18 minutes ago',
    shape: 'editable',
    investigation: 'locked',
    roadmap: 'locked',
    frozen: false,
  },
  {
    id: 'quiet-gyms',
    title: 'Quiet gym sessions',
    brief: 'Bookable low-sensory gym hours for neurodivergent adults who want consistent equipment access without a crowded environment.',
    updated: 'Updated yesterday',
    shape: 'review',
    investigation: 'locked',
    roadmap: 'locked',
    frozen: false,
  },
  {
    id: 'clinic-translation',
    title: 'Translation QA for community clinics',
    brief: 'A review layer that helps small clinics check patient-facing translations before messages and instructions are sent.',
    updated: 'Research started 42 minutes ago',
    shape: 'frozen',
    investigation: 'running',
    roadmap: 'locked',
    frozen: true,
  },
  {
    id: 'grocery-refills',
    title: 'Refill tracking for independent grocers',
    brief: 'Lightweight container deposits and return tracking for grocers introducing package-free household staples.',
    updated: 'Report completed today',
    shape: 'frozen',
    investigation: 'ready',
    roadmap: 'available',
    verdict: { label: 'Test the critical assumption', confidence: 'Moderate confidence' },
    frozen: true,
  },
  {
    id: 'solar-handoffs',
    title: 'Field handoffs for solar crews',
    brief: 'A photo-first handoff record that keeps residential solar inspections, fixes, and installer notes in one clear trail.',
    updated: 'Updated three days ago',
    shape: 'frozen',
    investigation: 'complete',
    roadmap: 'available',
    verdict: { label: 'Worth pursuing', confidence: 'High confidence' },
    frozen: true,
  },
  {
    id: 'furniture-returns',
    title: 'Furniture returns triage',
    brief: 'Guided photo capture that helps independent furniture retailers route damaged deliveries to the right resolution quickly.',
    updated: 'Roadmap completed last week',
    shape: 'frozen',
    investigation: 'complete',
    roadmap: 'complete',
    verdict: { label: 'Refine before pursuing', confidence: 'Moderate confidence' },
    frozen: true,
  },
  {
    id: 'event-kit',
    title: 'Reusable event-kit logistics',
    brief: 'Collection and turnaround planning for venues that lend reusable cups, plates, and serving kits to local event organizers.',
    updated: 'Research needs attention',
    shape: 'frozen',
    investigation: 'failed',
    roadmap: 'locked',
    frozen: true,
  },
]

/**
 * Replace this function with an API call without changing the rendering layer.
 * @returns {Promise<Idea[]>}
 */
export async function getIdeas() {
  return structuredClone(mockIdeas)
}
