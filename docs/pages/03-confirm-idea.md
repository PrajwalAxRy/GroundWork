# Page: Confirm Idea

## Purpose

Confirm Idea is the focused handoff between free Shape and paid Investigation. It lets the user correct Groundwork's understanding, intentionally defer uncertainties to research, understand the research scope, and explicitly approve the credit spend.

## Suggested Route

`/ideas/:ideaId/confirm`

## Entry Points

- **Review idea** from Shape
- An assistant suggestion that enough information exists to investigate
- **Review idea** from the Shape stage on Your Ideas

## Required Data

- Editable draft Idea Brief
- Provenance and status for each Brief field
- Open research questions
- Proposed Investigation scope
- Current credit balance
- Investigation credit cost placeholder or configured value
- Whether sufficient credits are available
- Submission state

## Page Contents

### Header

- Back to Shape
- Heading: **Before we investigate**
- Short explanation that the user can correct important details or defer uncertainty to research

### Editable Brief

The Brief contains:

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

Each field shows one of:

- Confirmed
- Groundwork's assumption
- Investigate this for me

### Research summary

Show a persistent summary on desktop and an inline summary on mobile containing:

- Investigation scope
- Geography
- Questions Groundwork will investigate
- What the report will include
- Current credit balance
- Required credits
- Failure protection statement

### Actions

- Primary: **Confirm and investigate**
- Secondary: **Continue shaping the idea**

If the user lacks credits, change the primary action to **Add credits and investigate** and route to the contextual Credits page.

## Interactions

### Edit a field

- Selecting an editable field enables direct correction.
- Saving changes marks the value as confirmed unless the user explicitly chooses research deferral.
- Editing the Brief does not rewrite the visible chat transcript.

### Investigate this for me

- The user can mark an uncertain field or question for Investigation.
- The item is added to the research scope.
- The page must explain that unresolved details can reduce confidence.
- This state is intentional and must not look like a validation error.

### Return to Shape

Selecting **Continue shaping the idea** returns to the editable conversation with all current draft changes preserved.

### Start Investigation

When sufficient credits exist:

1. Validate that a minimally understandable Idea exists.
2. Save the final confirmed Brief.
3. Freeze the Brief and Shape conversation.
4. Reserve the required credits.
5. Create one idempotent Investigation run.
6. Open Investigation Progress.

Repeated clicks must not create duplicate runs or charges.

### Add credits and start

When credits are insufficient:

1. Open Credits in contextual Investigation mode.
2. Preserve the confirmed Brief and research scope.
3. If the selected purchase action explicitly says it will start Investigation, return and begin the run after successful payment.

## Validation and Failure States

### Unknown fields

Allowed. They must be marked for research or acknowledged as unresolved.

### Missing core Idea

If the Idea itself is too empty to research, explain what minimum clarification is needed and return the user to Shape. Do not frame normal uncertainty as an error.

### Save failure

- Preserve edits locally.
- Do not freeze the Brief.
- Do not reserve credits.
- Offer retry.

### Run-creation failure

- Keep the Brief confirmed but do not leave it in an ambiguous charged state.
- Release any temporary reservation if the job was not created.
- Offer retry and return-to-Ideas.

## Mobile Behavior

- Place the research summary after the editable Brief or in a collapsible summary region.
- Keep the final credit cost visible near the primary action.
- Avoid a narrow permanent sidebar.

## Prototype Scenarios

1. Mostly confirmed Brief with sufficient credits
2. Several fields marked **Investigate this for me**
3. Groundwork assumptions awaiting confirmation
4. Insufficient credits
5. Save or submission failure

## Out of Scope

- Preliminary verdict
- Live research results
- Editing after Investigation begins
- Exact final credit price

