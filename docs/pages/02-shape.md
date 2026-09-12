# Page: Shape

## Purpose

Shape is the free cofounder conversation where a rough thought becomes a clearer, researchable Idea. It must feel like a useful conversation, not a questionnaire.

## Suggested Route

`/ideas/:ideaId/shape`

## Entry Points

- **Start shaping** from Your Ideas
- **Continue shaping** from an Idea card
- Completed Shape control for a frozen Idea
- **Continue shaping the idea** from Confirm Idea

## Required Data

- Idea identifier and title
- Conversation messages
- Current structured Idea Brief
- Field provenance: confirmed, inferred, suggested, unknown, or conflicting
- Current Idea Summary
- Readiness state
- Whether the Brief is frozen
- Pending or failed-message state

## Page Contents

### Page header

- Back to **Your Ideas**
- Idea title
- Stage label: **Shape**
- Frozen status when applicable

### Conversation area

- User and cofounder messages in chronological order
- Clear pending response state
- Retry affordance for failed assistant responses
- No research-source or browser UI

The cofounder should normally:

1. Respond specifically to the user's latest contribution.
2. Add a useful observation, suggestion, alternative, or constructive challenge.
3. Ask no more than one main question.

### Idea Summary

On desktop, show one floating or sticky summary panel containing:

- One-sentence Idea
- Target user
- Problem
- Proposed solution
- Likely business model
- Primary uncertainty

Inferred or suggested information must be visibly distinguished from confirmed information.

On mobile, use a collapsible **Current idea** panel rather than a permanently visible second column.

### Composer

For editable Ideas:

- Multiline message input
- Send button
- Persistent secondary action: **Review idea**

The user may also end naturally by telling the assistant they are done.

## Interactions

### Send a message

1. Preserve the user's text immediately in the conversation.
2. Disable duplicate sends while the same request is pending.
3. Show the cofounder response when ready.
4. Update the Idea Summary after meaningful changes, normally every two or three turns.

### Defer research questions

If the user asks for current competitors, revenue, pricing, market size, regulations, or another external fact, Shape must:

- Explain that Investigation will verify it using live research
- Record it as an open Investigation question
- Avoid pretending to have searched the internet

Shape itself has no internet access.

### Review the Idea

Selecting **Review idea** opens Confirm Idea. It is always available and does not require every Brief field to be answered.

When important information is missing, explain that the user may continue shaping or allow Investigation to explore the uncertainty.

### Correct an assistant misunderstanding

The user corrects misunderstandings through normal conversation. Groundwork then updates the structured Brief and its provenance.

## Editable State

- Conversation composer is available.
- **Review idea** is available.
- Idea Summary can continue updating.
- The AI may suggest that the Idea is ready, but cannot force the transition.

## Frozen State

After Investigation starts:

- Show the full chat as a read-only transcript.
- Remove the composer.
- Disable Brief and Summary editing.
- Show a notice: **This Idea was frozen when Investigation began.**
- Allow navigation to Investigation and Roadmap through the appropriate stage controls or page links.
- Material changes must start a new Idea rather than alter this one.

## Error and Loading States

### Initial loading

Use message and summary skeletons.

### Assistant response failure

- Keep the user's message.
- Show a retry action attached to the failed response position.
- Do not duplicate the user's message on retry.

### Summary update delay or failure

- Keep showing the last valid Summary.
- Do not block the conversation.
- Never replace valid Summary fields with empty values.

### Conversation unavailable

- Explain that the transcript could not load.
- Provide retry and return-to-Ideas actions.

## Mobile Behavior

- Keep the conversation as the primary surface.
- Move Idea Summary into a collapsible panel.
- Keep the composer reachable when the on-screen keyboard is open.
- Ensure **Review idea** remains available without obscuring messages.

## Prototype Scenarios

1. Early conversation with a sparse Summary
2. Developed conversation with inferred and confirmed fields
3. User asks for live competitor research and the assistant defers it
4. Assistant response failure with retry
5. Frozen, read-only transcript

## Out of Scope

- Internet search
- Inline sources
- Multiple summary cards
- Answered and unanswered-question sidebars
- Preliminary verdict
- Voice or file uploads in the first prototype

