# Page: Investigation Report

## Purpose

The Investigation Report helps a user decide whether to pursue an Idea, understand the strongest evidence and obstacles, and identify the most useful next action. It should be concise, interactive, evidence-aware, and easier to explore than a long PDF.

## Suggested Route

`/idea/investigate/:ideaId`

## Entry Points

- **Read investigation** from completed Investigation Progress
- **Report ready** or **Open investigation** from an Idea card
- Return from a paid follow-up action
- Return from the Roadmap

## Required Data

- Frozen Idea identifier, title, and Brief
- Research date and geography
- Verdict bucket
- Confidence label
- Verdict reasoning
- Evidence coverage summary
- Every report section and section status
- Competitors
- Source records
- Research limitations
- Relevant registered paid follow-up actions
- Whether a Roadmap exists or is available to generate

## Allowed Verdicts

- Worth pursuing
- Refine before pursuing
- Test the critical assumption
- Major obstacles
- Reconsider this version

Do not display a numeric score out of 100.

## Page Structure

### Page header

- Back to Your Ideas
- Idea title
- Stage label: **Investigation**
- Research date and geography
- Access to the read-only Shape transcript

### Section navigation

On desktop, use sticky section navigation with active-section highlighting.

On mobile, use a compact contents control or inline table of contents. The navigation is generated from sections actually rendered, so omitted sections never create dead links.

### First viewport

Show:

- Investigated Idea
- Verdict bucket
- Confidence
- Two or three strongest reasons
- Strongest concern
- Recommended version of the Idea
- Best immediate next action
- Compact evidence coverage summary

This area must answer what Groundwork concluded, why, and what the user should do next.

## Core Sections

### 1. Decision drivers

Show a concise balance of:

- Encouraging signals
- Reasons for caution
- Strongest argument against the Idea
- Evidence that could improve or weaken the verdict

### 2. Customer and problem evidence

Show:

- Most plausible customer segments
- Recommended starting segment
- Problem and buying trigger
- Current alternatives
- Evidence supporting the problem
- Important uncertainties

Avoid fictional named personas unless supported by real research.

### 3. Competitive landscape

Show direct competitors, indirect alternatives, and the status quo when available.

Each competitor card may show:

- Company name
- Website
- Short description
- Target customer
- Pricing, when available
- Traction or revenue, only when verifiable
- Main strength
- Potential weakness or gap

Selecting a competitor opens a standard detail drawer with the available expanded information. The drawer must work as a focused sheet or view on mobile.

Do not implement competitor selection, comparison, or a comparison matrix.

### 4. Demand and market signals

Show:

- Observable demand signals
- Industry trends
- Relevant spending or adoption behavior
- Regulatory or technical changes when relevant
- Market-size range only when credible
- Method and confidence for any estimate

When reliable market sizing is unavailable, prioritize evidence-based demand signals and state the limitation.

### 5. Business model

Show:

- Likely buyer and user
- Plausible monetization models
- Comparable pricing, when verified
- Major cost or margin considerations
- Retention or repeat-purchase characteristics
- Most plausible model and why

Distinguish verified facts, external estimates, Groundwork inferences, and unknowns.

### 6. Feasibility and difficulty

Use the relevant Idea playbook.

Possible SaaS dimensions:

- Product scope
- Technical complexity
- Data availability
- Integrations
- Customer acquisition
- Defensibility

Possible physical-product dimensions:

- Manufacturing
- Suppliers
- Unit economics
- Logistics
- Certification
- Distribution

Rows may expand inline to reveal concise reasoning. Use low, moderate, or high labels where useful, not an arbitrary total score.

### 7. Critical assumptions and risks

Each item includes:

- Assumption or risk
- Potential impact
- Evidence strength
- Why it matters
- Cheapest useful test
- Whether it blocks building

This may use a visual impact and evidence-strength matrix. Every item must also be available through an accessible list presentation.

### 8. Recommended refinement

Compare:

- Current Idea
- Recommended version
- What changed
- Why the change may improve the opportunity
- What was intentionally retained

The comparison stacks vertically on smaller screens.

### 9. What would change the verdict

Show:

- Evidence that would improve the verdict
- Evidence that would weaken it
- Questions the research could not answer
- Useful real-world actions

### 10. Optional controlled sections

The report may add a relevant playbook or AI-proposed section, such as regulation, marketplace liquidity, manufacturing constraints, investor-relevant signals, or a SWOT-style synthesis.

It must use approved content blocks. The AI cannot generate arbitrary HTML, React, or an unknown component type.

### 11. Research limitations and sources

Sources are not embedded as numbered citations throughout the report.

At the end, show **Sources used in this investigation** as an accordion collapsed by default. When opened, list:

- Source title
- Publisher or domain
- Link
- Optional grouping by report section

Also show concise research limitations. The backend retains detailed claim-to-source relationships even though they are not exposed inline.

### 12. Continue from here

Show only relevant next actions, such as:

- Build my Roadmap
- Investigate the recommended version as a new Idea
- Deeper competitive analysis
- Pricing or demand analysis
- Similar solutions in another country
- Different target segment or geography

The backend owns labels, prices, eligibility, and discounts. The AI may only recommend registered action identifiers.

## Interactions

### Navigate sections

Selecting a section scrolls to it. Active highlighting follows the current section on desktop.

### Open competitor details

Selecting a competitor opens its detail drawer. Missing fields are omitted without leaving broken labels.

### Expand feasibility details

Selecting a feasibility row reveals its explanation inline.

### Inspect a risk

Selecting a risk reveals its reasoning and suggested test. The implementation may use inline expansion or a shared detail drawer.

### Open sources

Selecting the Sources accordion reveals the complete source list. It is closed by default.

### Report an issue

Provide **Report an issue** on the completed report. It opens a small feedback form with:

- Issue category, such as incorrect, outdated, misunderstood Idea, unsupported conclusion, or other
- Optional explanation
- Submit and cancel actions

Submission only collects feedback. It does not automatically correct the report, regenerate it, refund credits, or promise a response.

### Start a paid follow-up

- Explain what the action produces and its credit cost.
- Require explicit confirmation before reserving credits.
- If credits are insufficient, open Credits in contextual mode.
- A modified Idea creates a separate Idea and never changes this report.

## Missing and Partial Data

Each section reports one status:

- Complete
- Partial
- Insufficient evidence
- Not applicable

Rendering rules:

- **Complete:** Render normally.
- **Partial:** Render useful findings with a concise limitation note.
- **Insufficient evidence:** Explain what could not be established and avoid guessing.
- **Not applicable:** Omit the section and navigation item.
- **Technical failure:** Do not present the run as a completed report.

Field-level examples:

- Missing pricing: Omit it or say pricing is not publicly available.
- Unverified revenue: State that no reliable public revenue data was found.
- Empty competitor result: Explain whether no strong direct competitors were found and show alternatives or status quo when available.
- Fewer list items: Reflow naturally rather than displaying empty placeholders.

## Mobile Behavior

- Replace sticky side navigation with a compact contents pattern.
- Convert detail drawers into focused mobile sheets or views.
- Keep the verdict and main reasoning readable without horizontal scrolling.
- Allow the risk matrix to fall back to its list form.
- Stack Idea-refinement comparisons.
- Keep paid follow-ups at the report end rather than in an obstructive persistent banner.

## Prototype Scenarios

1. Complete SaaS report
2. Physical-product report with manufacturing module
3. Partial report section
4. Insufficient market-size evidence
5. Competitor with missing pricing and revenue
6. No strong direct competitors
7. Optional AI-proposed section
8. Report issue form
9. Insufficient credits for Roadmap

## Out of Scope

- Inline numbered citations
- Competitor comparison
- Numeric potential score
- Public sharing
- PDF export
- Editing the frozen Brief
- Arbitrary AI-generated UI

