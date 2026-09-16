# Page: Investigation Progress

## Purpose

Investigation Progress reassures the user that paid research is continuing in the background, communicates genuine system state, and provides a safe recovery path when research fails.

## Suggested Route

`/idea/investigate/:ideaId/progress`

## Entry Points

- Successful **Confirm and investigate** action
- Successful contextual credit purchase
- **View research progress** from an Idea card
- Returning to an Investigation that is still running
- Failed Investigation state from Your Ideas

## Required Data

- Idea identifier and title
- Frozen one-sentence Brief
- Investigation run identifier
- Credits reserved
- Current job status
- Ordered research phases and their states
- Start time and last status update
- Failure reason and credit state, when applicable

## Page Contents

### Header

- Back to Your Ideas
- Idea title
- Stage label: **Investigation**

### Primary status

Explain what is happening using the actual job state.

Suggested running copy:

> Groundwork is investigating your Idea. You can leave this page and return later.

Do not promise an exact completion time unless the production system has reliable data.

### Research phases

Display these phases:

1. Preparing the research plan
2. Mapping competitors and alternatives
3. Gathering customer and demand evidence
4. Evaluating business model and feasibility
5. Checking claims and sources
6. Assembling the report

Each phase can be waiting, active, completed, or failed. Do not show a fake overall percentage.

### Reserved-credit note

Show this as a compact footer attached to the progress surface. Explain that credits are reserved and will be finalized only after successful report completion.

## Interactions

### Leave the page

The user may return to Your Ideas at any time. Research continues in the background.

### Return later

The Idea card opens this same run. A refresh must restore the current state without starting another job.

### Completion

When the report passes its quality gate:

- Mark all completed phases accurately.
- Change the page to **Your report is ready**.
- Show primary action: **Read investigation**.
- Mark reserved credits as consumed.

The prototype does not need to automatically navigate away from the completed state.

### Failure

When the run fails terminally:

- State that the Investigation could not be completed.
- Confirm that reserved credits were released.
- Show **Retry investigation**.
- Show **Return to Your Ideas**.
- Do not expose raw infrastructure or model errors.

A retry refers to the same frozen Brief and must not charge twice for the same failed attempt.

## Page States

- Queued
- Researching
- Verifying
- Assembling
- Completed
- Failed with credits released
- Temporarily unable to load status

For a temporary status-loading error, do not claim that research failed. Offer refresh while preserving the last known state.

## Mobile Behavior

- Stack phases vertically.
- Keep the main status and leave-page reassurance near the top.
- Avoid a large animated progress graphic that pushes useful status below the fold.

## Prototype Scenarios

1. Queued before research begins
2. Active competitor research
3. Verification
4. Completed report
5. Terminal failure with credits released
6. Temporary status-fetch error

## Out of Scope

- Fake percentage completion
- Activity-count panels or metric grids
- Streaming unverified findings
- Starting another run from repeated clicks
- Detailed technical logs
- User-controlled cancellation unless later approved

