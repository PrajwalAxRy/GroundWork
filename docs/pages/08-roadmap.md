# Page: Roadmap

## Purpose

The Roadmap gives the user a concise overview of what pursuing the Idea could look like. It focuses on the journey, immediate validation, major phases, milestones, and decisions without becoming a task manager or detailed implementation plan.

The main Roadmap should take roughly five to eight minutes to read.

## Suggested Route

`/idea/roadmap/:ideaId`

## Entry Points

- **Open Roadmap** from completed Roadmap Progress
- **Open roadmap** from an Idea card
- Return from the Investigation
- Return to an existing Roadmap follow-up conversation

## Required Data

- Frozen Idea identifier, title, and Brief
- Investigation summary and verdict
- Recommended path
- Three to five milestone-overview phases
- Zero to three pre-build experiments
- Three to five detailed phases
- Existing Roadmap chat messages
- Whether a chat request requires a new paid action

## Page Structure

### Header

- Back to Your Ideas
- Link back to Investigation
- Idea title
- Stage label: **Roadmap**

### Recommended path

Briefly state:

- Where to begin
- Intended first customer
- Most important constraint
- Immediate next move

### Gantt-inspired milestone overview

Show three to five major phases as an attractive, diluted overview.

Each overview item contains:

- Short phase name
- One-line objective
- Ending milestone
- Sequence

The frontend controls all geometry. The AI provides only the ordered content.

Do not include:

- Calendar dates
- Strict timeline axis
- Dependency lines
- Drag-and-drop
- Task completion
- Progress tracking
- A claim that bar length is an exact duration

Selecting a phase may scroll to its detailed section.

### Before you build

When important uncertainty remains, show up to three experiments. Each contains:

- Assumption to test
- Simple test
- Evidence to look for

If there is no major blocker, this may be titled **Quick checks before committing**. Do not add empty experiment cards.

### Detailed phases

Show three to five phases. Each contains only:

- Objective
- Up to three important actions
- Milestone
- Main risk or decision to watch

The first phase may be open by default and later phases may expand inline. Phase content adapts to SaaS, marketplace, service, consumer, or physical-product Ideas.

Do not add detailed deliverables separate from milestones.

### Follow-up chat

On desktop, chat may use a collapsible right panel. On mobile, it opens as a focused view.

The chat receives:

- Frozen Idea Brief
- Completed Investigation
- Generated Roadmap
- Recent Roadmap chat

It has no internet access.

## Follow-up Chat Behavior

### Free clarification

The following remain free to the user:

- Explain a phase
- Prioritize what to do first
- Break down an existing phase
- Generate example interview questions from known context
- Adapt immediate advice to a user-provided time or budget constraint
- Clarify terminology, risks, milestones, or reasoning

### New paid work

The following require a separate paid action:

- Live vendor or manufacturer search
- New market or competitor research
- Different geography
- Modified Idea
- Recalculated verdict
- Substantial Roadmap regeneration

When a chat request requires paid work:

1. Explain why it exceeds clarification.
2. Present the relevant registered action and credit cost.
3. Require explicit confirmation.
4. Route to contextual Credits if the balance is insufficient.

The chat itself cannot spend credits or silently change the stored Roadmap.

## Interactions

### Select a milestone phase

Scroll to or reveal the matching detailed phase.

### Expand a phase

Reveal the objective, actions, milestone, and primary risk or decision inline.

### Ask about a phase

The user may open chat from a phase with that phase included as the immediate conversational context.

### Send a chat message

- Preserve the user's message immediately.
- Show a pending response state.
- Prevent duplicate sends.
- Keep the response grounded in the existing Brief, Investigation, and Roadmap.
- Offer retry without duplicating the user message if the response fails.

### Return to Investigation

Open the immutable Investigation report without altering the Roadmap or chat.

## Missing and Partial Data

- A Roadmap must have a recommended path and three to five valid phases before it is marked complete.
- Unsupported optional details are omitted.
- Missing pre-build experiments are acceptable when no blocking uncertainty exists.
- Missing phase objectives, milestones, or required actions trigger repair before completion.
- The milestone overview adapts to three, four, or five phases without empty positions.
- If chat context fails to load, keep the Roadmap readable and show a retry state only in the chat panel.

## Mobile Behavior

- Keep the Roadmap as the primary page.
- Make the milestone overview horizontally swipeable or provide an equivalent compact sequence.
- Expand detailed phases inline.
- Open chat as a focused view with an obvious return to the Roadmap.
- Do not require hover for phase or milestone information.

## Prototype Scenarios

1. SaaS Roadmap with four phases
2. Physical-product Roadmap with five phases
3. Roadmap with three pre-build experiments
4. Roadmap with no blocking experiments
5. Free clarification chat
6. Chat request that requires new paid research
7. Failed chat response with retry
8. Three-phase and five-phase mobile overview

## Out of Scope

- Weekly plans
- Completion checkboxes
- Project progress tracking
- Full functional Gantt chart
- Vendor directories
- Large interview-question library in the main Roadmap
- Exact budgets or strict schedules
- Specific technology-stack recommendations
- Legal or regulatory instructions
- Public sharing and export

