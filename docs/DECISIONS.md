# Groundwork Decision Log

Last updated: 2026-09-11

This file separates locked product decisions from topics that still need discussion. Future work should not reopen locked decisions unless the user explicitly asks to change them.

## Locked Decisions

### Audience and purpose

- Primary users are aspiring founders and people exploring startup ideas.
- Launch emphasis is SaaS and software, while supporting other Idea types through separate playbooks.
- Primary user question is whether to pursue an Idea, with modification guidance as a second goal.
- Groundwork reduces uncertainty and does not claim that AI research alone proves market validation.
- The commercial objective is to maximize sustainable credit revenue while providing genuine user value.

### Shape

- Shape is free.
- The assistant is a direct, constructive cofounder, not a questionnaire.
- Maximum one main question per response.
- It uses prior answers and actively offers suggestions.
- Users can finish early.
- The UI has one Idea Summary card, not separate answered and open-question cards.
- The summary updates after meaningful changes, normally every two or three turns.
- Shape has no internet access.
- Questions requiring live facts are explicitly deferred to Investigation and recorded for research.

### Confirmation and freezing

- A dedicated confirmation screen appears before Investigation.
- Users can mark uncertain fields as **Investigate this for me**.
- Investigation may proceed with unresolved questions, with appropriate confidence limitations.
- The Brief freezes when Investigation starts.
- Shape becomes a read-only transcript with no composer and no editable Brief.
- Material modifications create a separate Idea.

### Verdicts

- No numeric score out of 100.
- No preliminary free verdict.
- Verdict buckets are:
  - Worth pursuing
  - Refine before pursuing
  - Test the critical assumption
  - Major obstacles
  - Reconsider this version
- Verdicts include confidence and concise reasoning.

### Investigation

- Investigation is a paid live-internet research run.
- It is interactive and concise rather than a PDF-like wall of prose.
- Groundwork owns core sections and UI components.
- AI fills structured data and may propose controlled optional sections.
- AI never generates arbitrary product UI.
- Competitor cards may open a detail drawer.
- No competitor multi-select, comparison workflow, or comparison matrix.
- No embedded citation markers.
- Sources appear in one collapsed section at the end.
- Internal claim-to-source relationships remain stored for verification.
- Missing information has explicit complete, partial, insufficient-evidence, and not-applicable states.
- `Report an issue` collects feedback only and does not automatically regenerate, correct, or refund.
- Public sharing and export are not part of the MVP.
- SWOT-style analysis and investor-relevant insights are content goals, not mandatory standalone UI sections.

### Credits and progress

- Credits are reserved at job start and consumed on successful completion.
- Failed research releases the reservation.
- Duplicate actions must not duplicate jobs or charges.
- Research runs in the background.
- Progress shows genuine stages rather than a fake percentage.
- Users may buy enough for one Investigation or choose better-value larger packs.
- Follow-up research and substantial regeneration cost credits.
- Eligible follow-up analyses derived from an existing Investigation should cost fewer credits than the first full Investigation. Exact discount rules remain open.

### Roadmap

- Roadmap generation costs credits separately.
- It is an overview, not a detailed product-development engine.
- It begins with up to three pre-build validation experiments when uncertainty remains.
- It contains three to five phases.
- Each phase contains an objective, up to three actions, a milestone, and one main risk or decision.
- A visually appealing Gantt-inspired overview appears near the top.
- The overview uses milestones and sequence, not strict dates or project-management features.
- Dedicated resource directories, large interview scripts, exact budgets, weekly plans, exhaustive features, legal instructions, and tool-stack recommendations are omitted.
- Roadmap follow-up chat is free to the user.
- Roadmap chat has no internet access.
- New research, a new Idea, a new geography, or substantial regeneration requires credits and explicit confirmation.

### Product shell and dashboard

- Global top bar contains only Groundwork, Credits, and Profile.
- The logo returns to the dashboard.
- Dashboard header contains **Your ideas** and **New idea**.
- No separate Continue and Earlier Ideas sections.
- Ideas appear as a single-column stack of wide cards.
- Cards show title, short Brief, and Shape, Investigate, and Roadmap stage controls.
- The whole card is not one click target.
- State is never communicated using color alone.
- New Idea opens an inline idea input.
- Each modified or re-researched version is treated as a new Idea.
- The main product does not need to inherit its visual direction from the existing landing page.

## Superseded or Rejected Directions

- Multiple floating cards for answered and unanswered questions in Shape
- A visible form-like questionnaire for Shape
- Preliminary free verdict
- Numeric potential score
- One analysis template for every startup category
- Arbitrary LLM-generated sections or frontend code
- Competitor comparison selection and matrix
- Embedded numbered citations and citation hover previews
- Full functional Gantt chart
- Roadmap checklists and completion tracking
- Dedicated Roadmap resource and interview-question sections
- Dashboard split into Continue and Earlier Ideas
- My Ideas and New Idea controls in the global top bar
- Sharing and export in the MVP

## Open Product Decisions

### AI and research architecture

- Model choice for Shape, research, synthesis, verification, Roadmap, and chat
- Exact research orchestration and retry strategy
- Final structured output schemas and quality thresholds

### Data and infrastructure

- Database and object model implementation
- Authentication approach
- Background job platform
- Hosting and deployment
- Payment provider
- Notification delivery

### Commercial design

- Exact credit costs
- Pack sizes and prices
- Introductory credits or trial behavior
- Exact discount amounts and eligibility rules for follow-up analyses
- Free-chat abuse controls

### Onboarding

- Whether users can begin Shape anonymously
- When authentication is required
- Account creation and recovery flow

### Visual system

- Theme
- Color strategy and tokens
- Typography
- Spacing and density
- Elevation and borders
- Motion vocabulary
- Illustration and generated-media usage

### Trust and safety

- Privacy promises and retention periods
- Account and Idea deletion behavior
- Legal and business-advice disclaimers
- Web prompt-injection defenses
- Source-quality policy

### Quality and measurement

- AI evaluation datasets
- Hallucination and citation tests
- Product analytics and success metrics
- Prompt and schema versioning
- Human review or escalation policy

### Delivery

- Final MVP acceptance criteria
- Technical stack review
- Design experiment order
- Implementation sequence
- Screenshot review and approval checkpoints
