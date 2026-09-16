# Groundwork Product and UX Specification

Status: Working source of truth for decisions approved through 2026-09-16.

This document records the agreed product behavior in sufficient detail that it should not need to be rediscovered in future design or implementation discussions. Open decisions are listed in `docs/DECISIONS.md`.

The main product may use a visual direction designed independently from the existing landing page. The landing page is not a required visual reference for the authenticated experience.

## 1. Product Model

Groundwork revolves around one primary object: an **Idea**.

Each Idea has:

- One editable Shape conversation before Investigation
- One confirmed Idea Brief
- At most one Investigation report
- At most one Roadmap
- A free follow-up conversation attached to a purchased Roadmap

Any materially modified, re-researched, or geographically different version is a new Idea. It does not overwrite the original. The backend may retain an internal lineage field such as `derivedFromIdeaId`, but users interact with each version as an independent Idea.

## 2. Global Product Shell

### Top bar

The global top bar contains only:

- Groundwork logo on the left
- Credit balance on the right
- Profile control on the right

The Groundwork logo returns the user to the dashboard. Do not place **My Ideas** or **New Idea** in the global top bar.

### Dashboard header

The dashboard contains:

- Page title: **Your ideas**
- Primary action: **New idea**

There are no separate **Continue** and **Earlier ideas** sections.

### New Idea behavior

Selecting **New idea** opens the dedicated Shape start route at `/idea/shape/new`. The initial idea input belongs on that page. Submitting the first thought creates the Idea, assigns its stable ID, and continues at `/idea/shape/:ideaId` with that text already sent.

Do not create an empty Idea before the first message is submitted.

### Ideas layout

Ideas appear as a single-column stack of wide entity cards rather than a multi-column tile grid.

The approved production direction is **Signal edge**, demonstrated at `/_experiments/idea-card-6/` and specified in `DESIGN.md`.

Each card contains:

- Editable Idea title
- Brief limited to roughly two lines
- Shape, Investigate, and Roadmap controls
- One emphasized current action, with the other two stages presented as quieter secondary controls
- Overflow actions for rename and delete

The collapsed dashboard card does not show verdict or last-updated metadata. Those values may remain available in the underlying Idea data for report context and dashboard sorting.

The card itself is not one large click target because it contains distinct stage controls.

Example:

```text
Eco-friendly cutlery for events

Compostable branded cutlery kits for small event organizers
and catering businesses.

[Continue shaping]    [Investigation locked]    [Roadmap locked]
```

### Stage states

Do not communicate clickability through color alone.

- **Current action:** Brand emphasis and clear action copy
- **Completed:** Checkmark, quieter style, remains clickable where applicable
- **Available next:** Clear enabled treatment
- **Running:** Progress indicator and status label
- **Ready:** Highlighted status such as **Report ready**
- **Locked:** Muted treatment, lock icon, disabled semantics
- **Failed:** Warning treatment and recovery action

Typical actions include:

- Continue shaping
- Review idea
- Start investigation
- View research progress
- Read report
- Build roadmap
- View roadmap progress
- Open roadmap
- Retry research

### Mobile dashboard

Idea cards remain vertically stacked. Their three stage controls may wrap cleanly when needed. The top bar remains compact, with credits and profile accessible without adding bottom navigation.

## 3. Stage One: Shape

### Purpose

Shape turns an early thought into a clearer, researchable Idea Brief. It is free to the user.

### Conversation character

The assistant acts like a direct but constructive cofounder. It should:

- Respond specifically to what the user said
- Add an observation, challenge, alternative, or suggestion
- Ask at most one main question per response
- Offer multiple possibilities inside that one question when useful
- Use prior answers intelligently
- Avoid repeated questions
- Avoid empty praise
- Challenge the idea, not the person
- Let the user stop at any time

The conversation must not feel like a form or a sequence of disconnected questions.

### Invisible conversational modes

The assistant may move naturally between:

1. **Explore:** Understand the initial thought without narrowing too quickly.
2. **Sharpen:** Clarify the customer, problem, solution, and commercial logic.
3. **Challenge:** Surface contradictions, weak assumptions, and alternatives.
4. **Converge:** Summarize the strongest current version and suggest Investigation.

These modes are internal. They are not shown as user-facing steps.

### Hidden coverage map

Groundwork quietly tracks:

- Problem
- Target user
- Buyer, if different from the user
- Proposed solution
- Value proposition
- Existing alternatives
- Market or geography
- Likely business model
- Distribution idea
- Founder advantages or constraints
- Critical assumptions
- Open questions

Each field can be:

- Confirmed
- Inferred
- Suggested
- Unknown
- Conflicting

Inferred and suggested content must never silently become confirmed.

### No internet access

The Shape assistant must not receive web-search or internet tools.

When a user asks for current competitors, market sizes, revenue, pricing, current regulations, or another external fact, the assistant must:

1. Explain that the paid Investigation will verify it using live research.
2. Add it to the Investigation questions.
3. Avoid presenting model memory as current evidence.

It may discuss likely categories and conceptual possibilities if clearly framed as hypotheses.

### Supporting Idea Brief

Shape uses two compact supporting cards. **Working summary** remains visible and updates as the conversation develops. **Captured details** is collapsed by default and expands into a quiet, readable list of labels and values without counts, preview text, status icons, or row dividers. The cards sit beside the conversation on desktop and follow it on narrower screens.

The structured Brief still stores confirmed information, inference, suggestions, conflicts, and unknowns. The compact card deliberately omits that provenance to remain scannable. Users correct misunderstandings and identify uncertainties through the Shape conversation rather than through a field-by-field form.

The supporting Brief updates after meaningful changes, normally every two or three turns. Groundwork must never promote inferred or suggested information into a confirmed state.

### Ending Shape

The persistent action is **Review idea**, not **Finish chat**.

The assistant may suggest review when enough is known, but the user can select it at any time. Unanswered matters do not block Investigation. Groundwork explains that unresolved details may reduce confidence and can be explored during research.

## 4. Idea Brief Review

Selecting **Review idea** opens a focused modal over Shape. It does not navigate to a dedicated confirmation page.

The approved modal is a lightweight summary checkpoint. It contains:

- Title: **Review your idea**
- A short explanation that the user is checking Groundwork's understanding
- The current Idea summary

It does not expose the full structured Brief, field provenance, field editors, research-question controls, Investigation scope, report previews, or credit-purchase content. If the summary is wrong or incomplete, the user returns to the conversation and corrects Groundwork naturally.

Primary action: **Looks right**

Secondary action: **Keep shaping**

Closing the modal or selecting **Keep shaping** returns to the unchanged Shape conversation. Selecting **Looks right** records that the user accepts the current summary. It does not silently promote inferred, suggested, conflicting, or unknown Brief fields to confirmed status or spend credits.

After **Looks right**, Shape enters a reversible **paused for review** state. The conversation remains visible as a read-only transcript, the Working summary and Captured details cards become read-only, and the composer is replaced by a focused Investigation handoff card. That card repeats the accepted summary and provides **Continue shaping** and **Start investigation**. **Continue shaping** restores the composer; a material change makes the accepted summary stale and requires review again. This is not the permanent Brief freeze, which occurs only after the user separately confirms and starts Investigation.

Research scope, credit cost, current balance, and failure protection belong to the separate paid Investigation-start action. Selecting **Start investigation** opens a focused confirmation modal over Shape. The modal always uses the same fixed overview, rather than idea-specific copy or a detailed research plan: customer and demand, competition analysis, business reality, and evidence checks. It then requires explicit confirmation before credits are reserved. Keep the modal free of a separate cost or balance summary: the global shell retains the balance and the primary action shows the cost as a compact credit icon and amount.

## 5. Brief Freeze

As soon as Investigation begins:

- The confirmed Idea Brief becomes read-only.
- The Shape conversation remains available as a transcript.
- The Shape composer is removed.
- The Idea Summary cannot be edited.
- A notice explains that the Idea was frozen when Investigation began.

Any subsequent change to the customer, solution, geography, business model, or another material assumption creates a new Idea.

## 6. Credits and Research Initiation

### Credit behavior

- Shape is free.
- No preliminary verdict is shown before payment.
- Full Investigation costs credits.
- Roadmap generation costs credits separately.
- Meaningful follow-up analyses cost credits.
- Small clarifications on an already purchased Roadmap are free.

At research start, credits are reserved. They are consumed only after successful completion. A failed research job releases the reservation.

The user should see:

- A high-level overview of what will be investigated
- The credit cost in the final action
- A clear statement about failure protection

Recommended action copy:

> Start investigation [credit icon] [amount]

For the current frontend prototype, an Investigation costs **5 credits** and the example available balance is **10 credits**. These are provisional fixtures only. Exact commercial pricing, pack sizes, and introductory-credit policy remain undecided and must be owned by the backend when implemented.

### Credit purchasing

Offer both:

- A low-commitment option sufficient for one Investigation
- Larger credit packs with better value

If an action explicitly says **Buy credits and start investigation**, successful payment may start the job automatically. A general credit purchase must not automatically spend credits.

## 7. Research Progress

Investigation runs as a durable background job. Users can leave and return.

Display real phases instead of a fake percentage:

1. Preparing the research plan
2. Mapping competitors and alternatives
3. Gathering customer and demand evidence
4. Evaluating business model and feasibility
5. Checking claims and sources
6. Assembling the report

The page may show truthful activity such as sources reviewed, sources retained, relevant competitors identified, and claims being cross-checked. Do not reveal unverified conclusions early.

Research states include:

- Awaiting payment
- Queued
- Researching
- Verifying
- Assembling
- Completed
- Failed

Duplicate clicks must not create duplicate charges or research runs.

## 8. Investigation Report

### Verdict

Do not use a score out of 100.

Allowed verdict buckets:

- Worth pursuing
- Refine before pursuing
- Test the critical assumption
- Major obstacles
- Reconsider this version

Every verdict includes a confidence label and short reasoning.

### Report experience

The report is a continuous, interactive page, not a PDF replica and not a dashboard of equally weighted cards.

Keep:

- Sticky section navigation with active-section highlighting
- Strong first viewport
- Expandable or inspectable entities where useful
- Responsive behavior
- Clear missing-data states
- Collapsible sources at the end

The first viewport contains:

- Investigated Idea and immutable version context
- Geography and research date
- Verdict and confidence
- Strongest supporting reasons
- Strongest concern
- Recommended version of the Idea
- Best immediate action
- Compact evidence coverage summary

### Core report sections

1. Verdict and confidence
2. Decision drivers
3. Customer and problem evidence
4. Competitive landscape
5. Demand and market signals
6. Business model
7. Feasibility and difficulty
8. Critical assumptions and risks
9. Recommended refinement
10. What would change the verdict
11. Research limitations and sources
12. Relevant paid follow-up investigations

Playbook-specific modules may adapt the report. Examples include technical feasibility and switching costs for SaaS, liquidity for marketplaces, and manufacturing or regulatory considerations for physical products.

The AI may propose an additional relevant section. It must use an approved generic content structure or a registered module. It must not generate arbitrary HTML or React.

### Competitors

Competitors appear as individual cards. A card may include:

- Company name and website
- Short description
- Target customer
- Pricing, when available
- Traction or revenue, only when verifiable
- Main strength
- Potential weakness or market gap

Selecting a card may open a standard responsive detail drawer. Do not include:

- Competitor multi-select
- Competitor comparison functionality
- Competitor comparison matrix

### Customer, feasibility, and risks

- Customer segments can appear as a ranked, scannable view.
- Feasibility can use expandable analytical rows.
- Risks and assumptions can use a visual impact and evidence-strength matrix with an accessible list alternative.
- Original and recommended Ideas can use a two-column comparison that stacks on mobile.

### Sources

Do not embed numbered citations throughout the report.

At the bottom, show **Sources used in this investigation** as a collapsed section by default. When expanded, it lists source title, publisher, and link, optionally grouped by report section.

The backend should still preserve claim-to-source relationships for verification, even though the user sees a consolidated source list.

### Missing information

Each report section has one of these states:

- Complete
- Partial
- Insufficient evidence
- Not applicable

The interface distinguishes:

- No information was found
- The information does not apply
- Research failed

Behavior examples:

- Missing competitor pricing: omit the row or say pricing is not publicly available.
- Unverified revenue: state that no reliable public revenue data was found.
- Partial section: render useful findings with a short limitation note.
- Not applicable: omit the section and its navigation item.
- Optional section missing: omit it cleanly.
- No direct competitors: explain the result and show indirect alternatives or the status quo when available.
- Critical malformed content: repair or retry before completing the report.
- Failed overall run: do not charge credits and do not present a misleading partial report.

Do not render empty cards, broken labels, repeated `N/A`, or `undefined` values.

### Report quality gate

A report is not complete without:

- Valid verdict
- Confidence and reasoning
- Customer and problem analysis
- Competitive findings or an explicit evidence-gap result
- Critical assumptions
- Recommended next action
- A reasonable set of research sources

### Report correction feedback

Include **Report an issue** in the completed report. It collects feedback only.

It does not automatically:

- Regenerate the report
- Correct the report
- Refund credits

### Paid follow-ups

At the report bottom, recommend only relevant next investigations, such as:

- Build a Roadmap
- Investigate a refined Idea as a new Idea
- Deeper competitive analysis
- Demand or pricing analysis
- Similar solutions in other countries
- A different target segment or geography

Follow-up analyses derived from an existing Investigation should generally cost fewer credits than the first full Investigation. The exact discount and eligibility rules remain to be priced.

The AI may recommend a registered extension identifier, but the backend owns the official name, description, eligibility, discount, and credit price.

SWOT-style strengths, weaknesses, opportunities, and threats, plus investor-relevant signals, are analysis goals rather than mandatory standalone UI sections. They should appear within the most relevant report sections or through an optional controlled section when the evidence warrants it.

## 9. Roadmap

### Purpose

The Roadmap answers:

> If I pursue this Idea, what would the broad journey look like?

It should take roughly five to eight minutes to read. It is not a detailed implementation plan or project-management system.

### Roadmap structure

#### Recommended path

Briefly state:

- Where to begin
- Intended first customer
- Most important constraint
- Immediate next move

#### Gantt-inspired milestone overview

Near the top, show an attractive, diluted Gantt-style overview with three to five major phases.

Each phase contains:

- Short phase name
- One-line objective
- Ending milestone
- Sequence

The visual contains no calendar axis, strict dates, dependencies, drag-and-drop, task progress, or claim that bar length represents a precise duration.

Selecting a phase may scroll to its detailed section. On mobile, it may be horizontally swipeable.

#### Before you build

When important uncertainty remains, show no more than three validation experiments. Each contains:

- Assumption to test
- Simple test
- Evidence to look for

If there is no major blocker, this can become **Quick checks before committing**.

#### Main phases

Generate three to five phases. Each contains only:

- Objective
- Up to three important actions
- Milestone
- Main risk or decision to watch

Phase names and content adapt to the Idea playbook. For example, software, marketplace, service, and physical-product journeys should not share a generic template when their real paths differ.

### Roadmap omissions

Do not add dedicated sections for:

- Large interview-question libraries
- People, services, and resources
- Repeated key decisions
- Detailed deliverables separate from milestones
- Exact timelines and budgets
- Specific tools or technology stacks
- Vendor or manufacturer directories
- Legal or regulatory instructions
- Exhaustive MVP feature lists
- Weekly task plans
- Completion checkboxes or progress tracking

Essential people, services, and decisions may be mentioned inside the relevant phase. Context-dependent details belong in follow-up chat or new paid research.

## 10. Roadmap Follow-up Chat

Follow-up chat on a purchased Roadmap is free to the user.

It receives the frozen Idea Brief, completed Investigation, and Roadmap as context. It does not receive internet access.

Free uses include:

- Explain a phase in simpler language
- Prioritize what to do first
- Break down an existing phase
- Generate example interview questions from the existing context
- Adapt immediate advice to a stated time or budget constraint
- Clarify terminology, risks, milestones, and reasoning

New paid work includes:

- Live vendor or manufacturer search
- New market or competitor research
- Different geography
- Modified Idea
- Recalculated verdict
- Substantial Roadmap regeneration

When paid work is needed, the assistant explains why and presents the relevant action. It cannot spend credits without explicit user confirmation.

On desktop, chat may appear as a collapsible right panel. On mobile, it opens as a focused view.

## 11. Explicit MVP Exclusions

- Public sharing
- PDF export
- Embedded inline citations
- Competitor comparison tools
- Full Gantt project management
- Roadmap task completion tracking
- Arbitrary AI-generated UI
- Deep live research inside Shape
- Internet access in Roadmap clarification chat
- Preliminary free verdict
