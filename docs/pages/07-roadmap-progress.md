# Page: Roadmap Progress

## Purpose

Roadmap Progress communicates that a paid Roadmap is being generated from the frozen Idea Brief and completed Investigation. It provides durable progress and safe failure handling without pretending that the Roadmap is ready immediately.

## Suggested Route

`/ideas/:ideaId/roadmap/progress`

## Entry Points

- Confirmed **Build my Roadmap** action with sufficient credits
- Successful contextual credit purchase
- Direct revisit of an active Roadmap URL
- Completion or failure notification
- Returning to an unfinished or failed Roadmap run

## Required Data

- Idea identifier and title
- Roadmap run identifier
- Credits reserved
- Current job state
- Ordered generation phases
- Start time and last update
- Failure reason and credit state, when applicable

## Page Contents

### Header

- Back to Investigation
- Idea title
- Stage label: **Roadmap**

### Primary status

Explain that Groundwork is turning the Investigation into a concise milestone-based journey and that the user may leave the page.

### Generation phases

Use truthful stages such as:

1. Reviewing the Investigation
2. Identifying pre-build checks
3. Sequencing milestones
4. Drafting Roadmap phases
5. Checking completeness

Do not display a fake percentage.

### Reserved-credit note

Explain that credits remain reserved until successful completion.

## Interactions

### Leave and return

The user may return to Your Ideas or Investigation. The Roadmap run continues in the background and can be reopened from its direct URL or a notification.

### Completion

- Change the page to **Your Roadmap is ready**.
- Show primary action: **Open Roadmap**.
- Consume the reserved credits only after the Roadmap passes validation.

### Failure

- State that the Roadmap could not be completed.
- Confirm that reserved credits were released.
- Show **Retry Roadmap**.
- Show **Return to Investigation**.
- Do not expose raw technical errors.

## Page States

- Queued
- Generating
- Checking
- Completed
- Failed with credits released
- Temporarily unable to load status

## Mobile Behavior

- Stack progress stages vertically.
- Keep the leave-page reassurance and credit status visible near the top.
- Avoid decorative animation that distracts from state.

## Prototype Scenarios

1. Queued
2. Sequencing milestones
3. Final checks
4. Completed
5. Failed with credits released
6. Temporary status-fetch error

## Out of Scope

- Showing incomplete Roadmap content
- Fake progress percentages
- Editing the frozen Brief
- User-controlled cancellation unless later approved
