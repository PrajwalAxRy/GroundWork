# Groundwork Decision Log

Last updated: 2026-09-16

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
- The supporting Brief updates after meaningful changes, normally every two or three turns.
- The previous Shape UI implementation was removed. Its layout, side-brief treatment, and responsive behavior are reopened for a future from-scratch design.
- Shape has no internet access.
- Questions requiring live facts are explicitly deferred to Investigation and recorded for research.

### Confirmation and freezing

- **Review idea** opens a focused Idea Brief modal over Shape; there is no dedicated confirmation page.
- The review modal contains the Idea Brief rather than Investigation scope, report previews, or credit-purchase content.
- Confirming the Brief does not itself spend credits. Investigation start remains a separate explicit paid action.
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
- Cards show the title, short Brief, one current action, and overflow actions.
- The approved dashboard card direction is the simplified **Signal edge** (`/_experiments/idea-card-6/`, evolved from experiment card 14): a compact horizontal card with a slim signal rail and one emphasized current action. The collapsed card omits verdict, last-updated metadata, secondary stage controls, and background-job details.
- Dashboard cards use only **Continue shaping**, **Review idea**, and **View roadmap**. Research progress, retry, report-ready, and other granular process states belong on their relevant stage pages.
- The whole card is not one click target.
- State is never communicated using color alone.
- New Idea opens an inline idea input.
- Each modified or re-researched version is treated as a new Idea.
- The main product does not need to inherit its visual direction from the existing landing page.

### Visual system

- The initial product visual system is the light-first, cool-paper direction documented in `DESIGN.md` and demonstrated by `/_experiments/idea-card-6/`.
- The palette is restrained: cobalt for primary and ready states, amber for running states, rust for failure or destructive actions, and cool blue-tinted neutrals for the workspace.
- Manrope is the approved heading and compact-title family. DM Sans is the approved body, label, and control family, with system sans-serif fallbacks.
- Semantic states always combine color with copy, icons, disabled semantics, or progress indicators.
- Important unapproved components must continue through development-only experiments before production integration.
- Shape has no current approved visual direction or production page. A future implementation must begin with a new experiment and approval cycle.

### Production frontend foundation

- This repository, `startup_validator_GPT`, is the canonical Groundwork application workspace. The sibling `startup_validator` folder remains an untouched reference until the user explicitly changes that arrangement.
- The production frontend uses Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, Radix primitives, Lucide icons, Motion, Zod, Biome, and Vitest with Testing Library. Exact installed versions are locked in `package-lock.json`.
- The existing landing page's visual implementation and necessary media are carried into this repository, but current Groundwork product decisions override any copied legacy wording or behavior.
- Marketing routes and product routes use separate route groups and visual layers. The product continues to use the approved light-first design rather than inheriting the landing page's dark presentation.
- Product pages consume typed data through a replaceable `ProductService` boundary. Runtime schemas validate untrusted data before it reaches structured UI.
- Folder, route, component, service, and validation responsibilities are defined in `ARCHITECTURE.md`.
- The landing-page dark hero uses its natural content height. Its research-dimension rail directly meets the first light band without a dark transition gap; the light section may appear within the initial viewport.

## Superseded or Rejected Directions

- A dedicated Confirm Idea page or `/ideas/:ideaId/confirm` production route
- The former cofounder-workspace Shape page and its divided Current idea panel
- The unapproved two-card Shape side-brief exploration
- Multiple floating cards for answered and unanswered questions in Shape
- One large divided Shape summary card showing confirmed, inferred, suggested, unknown, and conflicting fields together
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
- Multi-state dashboard cards with separate Shape, Investigate, and Roadmap controls
- Dashboard actions such as **Retry research**, **View progress**, **Read report**, and **Build roadmap**
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
- Exact placement of the paid Investigation-start confirmation after the Brief review modal

### Onboarding

- Whether users can begin Shape anonymously
- When authentication is required
- Account creation and recovery flow

### Visual system

- Shape page composition, conversation treatment, side brief, composer, and responsive behavior
- Long-form report composition and responsive section rhythm
- Verdict, competitor detail, risk visualization, and Roadmap overview treatments
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
- Design experiment order
- Implementation sequence
- Screenshot review and approval checkpoints
