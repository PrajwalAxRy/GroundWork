# Component: Review Idea modal

## Status

This specification supersedes the former dedicated Confirm Idea page. There is no production `/ideas/:ideaId/confirm` route.

## Purpose

The Review Idea modal is the focused handoff inside Shape. It lets the user inspect and correct Groundwork's understanding without losing the conversation context or entering a separate page.

## Entry Points

- **Review idea** beside the Shape composer on desktop
- **Review idea** beneath the composer on mobile
- An assistant suggestion that the Idea is ready to review
- **Review idea** from the Shape stage on Your Ideas, which opens Shape and then the modal

## Required Data

- Editable draft Idea Brief
- Provenance and review status for each Brief field
- Open research questions
- Submission and recoverable save state

## Modal Contents

The modal contains the Idea Brief only:

- Idea summary
- Problem
- Target customer
- Buyer, if different
- Proposed solution
- Value proposition
- Market or geography
- Likely business model
- Important assumptions
- Questions to investigate

Each field can be:

- Confirmed
- Groundwork's assumption
- Investigate this for me

The modal does not contain a report preview, a persistent research-summary sidebar, credit packs, or a full purchase surface.

## Actions

- Primary: **Confirm brief**
- Secondary: **Keep shaping**
- Standard close control

Confirming the Brief does not spend credits. The paid Investigation-start action is separate and must show scope, cost, balance, and failure protection before reserving credits.

## Interactions

### Edit a field

- Selecting an editable field enables direct correction.
- Saving a correction marks the value as confirmed unless the user deliberately defers it.
- Editing the Brief does not rewrite the visible chat transcript.

### Investigate this for me

- The user can mark an uncertain field or question for Investigation.
- The item is added to the research scope.
- Deliberate uncertainty is not styled as a validation error.

### Keep shaping

Closing the modal returns to the unchanged editable conversation. All draft Brief changes are preserved.

### Confirm brief

1. Validate that a minimally understandable Idea exists.
2. Save the reviewed draft Brief.
3. Close the modal and expose the next Investigation action.
4. Do not freeze the Brief or reserve credits yet.

The Brief and Shape conversation freeze only when the user separately confirms and starts the paid Investigation.

## Validation and Failure States

- Unknown fields are allowed when marked for Investigation or acknowledged as unresolved.
- If the core Idea is too empty to research, explain the minimum clarification needed and return focus to Shape.
- A save failure preserves edits, keeps the modal open, and offers retry.
- Closing and reopening the modal must not lose valid draft changes.

## Accessibility and Responsive Behavior

- Use an accessible modal with focus containment, Escape-to-close, labelled title and description, and focus restoration to **Review idea**.
- On desktop, keep the Shape workspace visible behind the overlay.
- On mobile, use a focused near-full-screen dialog with reachable actions and no narrow side-by-side layout.
- Long Brief content scrolls inside the dialog while the actions remain reachable.

## Prototype Scenarios

1. Mostly confirmed Brief
2. Several fields marked **Investigate this for me**
3. Groundwork assumptions awaiting confirmation
4. Incomplete but reviewable Brief
5. Recoverable save failure

## Out of Scope

- Dedicated confirmation page
- Credit-pack selection
- Preliminary verdict
- Live research results
- Editing after Investigation begins
