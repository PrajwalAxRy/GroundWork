/** @typedef {'complete'|'unread'|'available'} StageState */
/** @typedef {{ key: 'shape'|'investigate'|'roadmap', label: string, state: StageState, action: string, note: string }} Stage */
/** @typedef {{ id: string, title: string, brief: string, updated: string, signal: string, verdict: { label: string, confidence: string }, stages: Stage[] }} Idea */

/** @type {Idea} */
export const idea = {
  id: 'idea-04',
  title: 'Refillable cleaning supplies for small offices',
  brief: 'A scheduled refill service for offices that want to reduce single-use plastic without managing dispensers, inventory, or multiple suppliers.',
  updated: 'Sep 5',
  signal: 'New report',
  verdict: {
    label: 'Test the critical assumption',
    confidence: 'Moderate confidence',
  },
  stages: [
    { key: 'shape', label: 'Shape', state: 'complete', action: 'View transcript', note: 'Idea frozen' },
    { key: 'investigate', label: 'Investigate', state: 'unread', action: 'Read report', note: 'Report ready' },
    { key: 'roadmap', label: 'Roadmap', state: 'available', action: 'Build roadmap', note: 'Available next' },
  ],
}

export const variants = [
  { id: 'rail', number: '01', name: 'Decision rail', description: 'Balanced reading and action' },
  { id: 'focus', number: '02', name: 'Next-action focus', description: 'Strongest directional cue' },
  { id: 'spine', number: '03', name: 'Progress spine', description: 'Workflow-led scanning' },
  { id: 'table', number: '04', name: 'Stage table', description: 'Fast state comparison' },
  { id: 'compact', number: '05', name: 'Compact dossier', description: 'Higher list density' },
  { id: 'verdict', number: '06', name: 'Verdict-led', description: 'Outcome before workflow' },
]
