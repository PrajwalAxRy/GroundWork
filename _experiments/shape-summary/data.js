/** @typedef {'confirmed'|'inferred'|'suggested'|'unknown'|'conflicting'} Provenance */
/** @typedef {{ label: string, value: string, provenance: Provenance }} SummaryField */
/** @typedef {{ id: string, role: 'user'|'assistant', body: string, note?: string, failed?: boolean }} Message */
/** @typedef {{ title: string, frozen: boolean, readiness: string, summary: SummaryField[], messages: Message[] }} ShapeScenario */

const developedSummary = [
  { label: 'Idea', value: 'A shared inbox that helps independent clinics triage patient requests without replacing their practice software.', provenance: 'confirmed' },
  { label: 'Target user', value: 'Office managers and front-desk teams at independent clinics with 3 to 10 staff.', provenance: 'confirmed' },
  { label: 'Problem', value: 'Urgent patient requests get buried across email, phone notes, and portal messages.', provenance: 'inferred' },
  { label: 'Proposed solution', value: 'Bring requests into one queue, suggest urgency, and assign a clear owner.', provenance: 'suggested' },
  { label: 'Likely business model', value: 'Not clear yet', provenance: 'unknown' },
  { label: 'Primary uncertainty', value: 'Whether clinics will trust automated urgency suggestions or require a fully manual workflow.', provenance: 'conflicting' },
]

const developedMessages = [
  {
    id: 'm1',
    role: 'user',
    body: 'Small clinics seem to lose patient requests between email, phone calls, and their patient portal. I am thinking about one shared inbox for the front desk.',
  },
  {
    id: 'm2',
    role: 'assistant',
    body: 'The strongest part is not “another inbox.” It is giving every request a visible owner before it gets forgotten. That also makes the idea easier to position beside existing practice software instead of against it. Who feels the pain most sharply: the office manager, the person working the front desk, or a clinician waiting for messages to be triaged?',
  },
  {
    id: 'm3',
    role: 'user',
    body: 'Probably the office manager. They are responsible when something is missed, but the whole front-desk team would use it. I am picturing independent clinics with maybe 3 to 10 staff.',
  },
  {
    id: 'm4',
    role: 'assistant',
    body: 'That gives you a useful buyer and user split: the office manager buys control and accountability, while the team needs speed. The risky promise is urgency. A clinic may value suggested triage, but it may also distrust software making that call. Would you want the first version to suggest urgency for staff review, or avoid clinical interpretation and focus only on routing and ownership?',
  },
  {
    id: 'm5',
    role: 'user',
    body: 'Suggest urgency, but always let a person confirm it. The main win should be that nothing sits unseen and everyone knows who owns the follow-up.',
  },
]

/** @type {Record<string, ShapeScenario & { label: string }>} */
export const scenarios = {
  developed: {
    label: 'Developed conversation',
    title: 'A calmer inbox for independent clinics',
    frozen: false,
    readiness: 'Ready when you are',
    summary: developedSummary,
    messages: developedMessages,
  },
  early: {
    label: 'Early, sparse summary',
    title: 'A calmer inbox for independent clinics',
    frozen: false,
    readiness: 'Still taking shape',
    summary: [
      { label: 'Idea', value: 'A better way for small clinics to handle incoming patient requests.', provenance: 'inferred' },
      { label: 'Target user', value: 'Small clinic teams', provenance: 'inferred' },
      { label: 'Problem', value: 'Requests may be getting missed across several channels.', provenance: 'inferred' },
      { label: 'Proposed solution', value: 'Not clear yet', provenance: 'unknown' },
      { label: 'Likely business model', value: 'Not clear yet', provenance: 'unknown' },
      { label: 'Primary uncertainty', value: 'Which person owns this problem day to day.', provenance: 'suggested' },
    ],
    messages: developedMessages.slice(0, 2),
  },
  deferred: {
    label: 'Research deferred',
    title: 'A calmer inbox for independent clinics',
    frozen: false,
    readiness: 'One research question saved',
    summary: developedSummary,
    messages: [
      ...developedMessages,
      { id: 'm6', role: 'user', body: 'Who are the current competitors, and what do they charge clinics like this?' },
      {
        id: 'm7',
        role: 'assistant',
        body: 'That needs current market research, so I will not guess from memory. I have added competitor positioning and pricing to your Investigation questions. For shaping this version now, which alternative do you most expect a clinic to keep using if it does not choose you: a shared email inbox, its patient portal, or manual phone notes?',
        note: 'Saved for Investigation: current competitors and pricing for independent clinics.',
      },
    ],
  },
  failure: {
    label: 'Response failure',
    title: 'A calmer inbox for independent clinics',
    frozen: false,
    readiness: 'Your last message is saved',
    summary: developedSummary,
    messages: [
      ...developedMessages,
      { id: 'm8', role: 'user', body: 'Start with routing and ownership. The urgency suggestion can come later once we understand what clinics trust.' },
      { id: 'm9', role: 'assistant', body: 'Groundwork could not respond. Your message is still in the conversation.', failed: true },
    ],
  },
  frozen: {
    label: 'Frozen transcript',
    title: 'A calmer inbox for independent clinics',
    frozen: true,
    readiness: 'Idea frozen',
    summary: developedSummary.map((field) => ({ ...field, provenance: field.provenance === 'unknown' ? 'unknown' : 'confirmed' })),
    messages: developedMessages,
  },
  loading: {
    label: 'Loading',
    title: 'A calmer inbox for independent clinics',
    frozen: false,
    readiness: 'Loading',
    summary: [],
    messages: [],
  },
}

export const provenanceCopy = {
  confirmed: 'Confirmed',
  inferred: 'Groundwork inferred',
  suggested: 'Groundwork suggested',
  unknown: 'Unknown',
  conflicting: 'Needs resolving',
}
