# Component: Review Idea modal

## Status

Approved and integrated into Shape. This lightweight modal supersedes both the former dedicated Confirm Idea page and proposals for a detailed field-by-field Brief editor.

## Purpose

The modal gives the user one calm checkpoint: confirm that Groundwork's current summary captures the Idea. It is not a second form and does not replace the Shape conversation as the place to correct or clarify the Idea.

## Entry Points

- **Review idea** beside the Shape composer on desktop
- **Review idea** beneath the composer on mobile
- An assistant suggestion that the Idea is ready to review
- **Review idea** from the Shape stage on Your Ideas, which opens Shape and then the modal

## Required Data

- Current Idea summary
- Whether the summary has been accepted
- Pending or recoverable confirmation state when connected to the product service

The complete structured Brief and field provenance remain stored outside the modal.

## Modal Contents

- Title: **Review your idea**
- Description: **Check what Groundwork understands before you move on.**
- Label: **Idea summary**
- The current Idea summary

The modal does not contain:

- Field-by-field Brief details
- Editing controls
- Provenance or status controls
- **Investigate this for me** controls
- Investigation scope or report preview
- Credit cost, balance, or purchase controls

## Actions

- Primary: **Looks right**
- Secondary: **Keep shaping**
- Standard close control

## Interactions

### Keep shaping or close

Return to the unchanged Shape conversation. The user corrects misunderstandings, supplies missing information, or asks Groundwork to investigate uncertainty through normal conversation.

### Looks right

1. Record that the user accepts the current Idea summary.
2. Close the modal and return to Shape.
3. Do not mark every hidden Brief field as confirmed.
4. Do not freeze the Brief, reserve credits, or start Investigation.

The separate paid Investigation-start action must later show research scope, cost, balance, and failure protection before credits are reserved.

After acceptance, Shape enters a reversible **paused for review** state. The transcript and supporting cards remain visible but become read-only; the composer is replaced by a **Ready to investigate** card. The card contains the accepted summary, **Continue shaping**, and **Start investigation**. The latter opens the separate paid confirmation.

If the user selects **Continue shaping** and materially changes the Idea, the accepted state becomes stale and the user should review the updated summary again before starting Investigation.

## Validation and Failure States

- **Review idea** remains unavailable until enough conversation exists to produce a meaningful summary.
- If summary confirmation fails, keep the modal open, preserve the conversation and summary, and offer retry.
- Unknown and inferred Brief fields remain valid internal states; accepting the summary does not change their provenance.

## Accessibility and Responsive Behavior

- Use an accessible modal with focus containment, Escape-to-close, a labelled title and description, and focus restoration to **Review idea**.
- Keep the Shape workspace visible behind the overlay on desktop.
- Preserve the compact hierarchy on mobile with comfortable inset spacing and reachable actions.
- The summary wraps naturally and the modal must not require horizontal scrolling.

## Out of Scope

- Dedicated confirmation page
- Detailed Brief editor
- Credit-pack selection
- Preliminary verdict
- Live research results
- Editing after Investigation begins
