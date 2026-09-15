/** @typedef {'confirmed'|'inferred'|'suggested'|'unknown'|'conflicting'} Provenance */
/** @typedef {{ label: string, value: string, provenance: Provenance }} SummaryField */
/** @typedef {{ id: string, role: 'user'|'assistant', body: string, note?: string, failed?: boolean }} ShapeMessage */
/** @typedef {{ ideaId: string, frozen: boolean, readiness: string, summary: SummaryField[], messages: ShapeMessage[], openQuestions: string[] }} ShapeSession */

const clinicSummary = [
  { label: 'Idea', value: 'A shared inbox that helps independent clinics triage patient requests without replacing their practice software.', provenance: 'confirmed' },
  { label: 'Target user', value: 'Office managers and front-desk teams at independent clinics with 3 to 10 staff.', provenance: 'confirmed' },
  { label: 'Problem', value: 'Urgent patient requests get buried across email, phone notes, and portal messages.', provenance: 'inferred' },
  { label: 'Proposed solution', value: 'Bring requests into one queue, suggest urgency, and assign a clear owner.', provenance: 'suggested' },
  { label: 'Likely business model', value: 'Not clear yet', provenance: 'unknown' },
  { label: 'Primary uncertainty', value: 'Whether clinics will trust automated urgency suggestions or require a fully manual workflow.', provenance: 'conflicting' },
]

const clinicMessages = [
  { id: 'clinic-1', role: 'user', body: 'Small clinics seem to lose patient requests between email, phone calls, and their patient portal. I am thinking about one shared inbox for the front desk.' },
  { id: 'clinic-2', role: 'assistant', body: 'The strongest part is not “another inbox.” It is giving every request a visible owner before it gets forgotten. That also makes the idea easier to position beside existing practice software instead of against it. Who feels the pain most sharply: the office manager, the person working the front desk, or a clinician waiting for messages to be triaged?' },
  { id: 'clinic-3', role: 'user', body: 'Probably the office manager. They are responsible when something is missed, but the whole front-desk team would use it. I am picturing independent clinics with maybe 3 to 10 staff.' },
  { id: 'clinic-4', role: 'assistant', body: 'That gives you a useful buyer and user split: the office manager buys control and accountability, while the team needs speed. The risky promise is urgency. A clinic may value suggested triage, but it may also distrust software making that call. Would you want the first version to suggest urgency for staff review, or avoid clinical interpretation and focus only on routing and ownership?' },
  { id: 'clinic-5', role: 'user', body: 'Suggest urgency, but always let a person confirm it. The main win should be that nothing sits unseen and everyone knows who owns the follow-up.' },
]

/** @type {ShapeSession[]} */
export const shapeSessions = [
  {
    ideaId: 'idea-01',
    frozen: false,
    readiness: 'Ready when you are',
    summary: clinicSummary,
    messages: clinicMessages,
    openQuestions: [],
  },
  {
    ideaId: 'idea-02',
    frozen: false,
    readiness: 'Ready for review',
    summary: [
      { label: 'Idea', value: 'Redirect eligible fashion returns to nearby buyers before items travel back to a warehouse.', provenance: 'confirmed' },
      { label: 'Target user', value: 'Independent online fashion labels handling returns internally.', provenance: 'confirmed' },
      { label: 'Problem', value: 'Reverse shipping is slow, costly, and wasteful for small brands.', provenance: 'confirmed' },
      { label: 'Proposed solution', value: 'Match a returned item with a nearby pending order after a condition check.', provenance: 'confirmed' },
      { label: 'Likely business model', value: 'Per-redirect fee paid by the brand.', provenance: 'inferred' },
      { label: 'Primary uncertainty', value: 'Whether item verification can be reliable without adding more operational cost.', provenance: 'confirmed' },
    ],
    messages: [
      { id: 'returns-1', role: 'user', body: 'Small fashion brands spend a lot sending returns back to a warehouse. What if an eligible return could go straight to another nearby customer?' },
      { id: 'returns-2', role: 'assistant', body: 'The shipping reduction is attractive, but the business lives or dies on trust in item condition. A redirect that creates a second unhappy customer is worse than a normal return. Would the brand, the first customer, or a local partner verify the item before it moves?' },
      { id: 'returns-3', role: 'user', body: 'The first customer could photograph the item, but the brand should approve the redirect. I want to start with unworn items in their original packaging.' },
      { id: 'returns-4', role: 'assistant', body: 'That is a much tighter first version: original packaging, brand approval, and only a pending order nearby. Your next decision is commercial. Should the brand pay per successful redirect, or subscribe for a returns workflow even when no redirect is possible?' },
    ],
    openQuestions: [],
  },
]

export const provenanceCopy = {
  confirmed: 'Confirmed',
  inferred: 'Groundwork inferred',
  suggested: 'Groundwork suggested',
  unknown: 'Unknown',
  conflicting: 'Needs resolving',
}
