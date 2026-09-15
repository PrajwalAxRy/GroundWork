# Groundwork Website Build Plan

Last updated: 2026-09-16

## How to Use This File

This is the execution checklist for building the Groundwork website and product prototype. It tracks delivery work, not product decisions. Product behavior remains governed by `docs/DECISIONS.md`, `docs/PRODUCT_SPEC.md`, and `docs/AI_BEHAVIOR.md`.

- Complete the phases in order unless a dependency makes parallel work safe.
- Mark a child item complete only after it has been implemented and verified.
- Mark a phase complete only when every required child item and its approval checkpoint are complete.
- Important or uncertain UI must be approved through a development-only experiment before it is integrated.
- Keep backend-dependent work visibly separate from mock frontend behavior.
- Update `HANDOFF.md` when the immediate next phase changes.

## Current Position

The product foundations, initial visual system, and production-oriented **Your Ideas** page are complete. The next phase is the **Shape conversation and Idea Summary experiment**.

## Phase 0: Product Foundation

- [x] Define the product audience, positioning, and three-stage journey.
- [x] Define Shape, Investigation, and Roadmap behavior.
- [x] Record locked product decisions in `docs/DECISIONS.md`.
- [x] Record detailed behavior in `docs/PRODUCT_SPEC.md`.
- [x] Record AI boundaries and reliability rules in `docs/AI_BEHAVIOR.md`.
- [x] Create page-by-page functional specifications in `docs/pages/`.
- [x] Establish the experiment-first design approval workflow.

### Completion checkpoint

- [x] Future work can proceed without reopening settled product decisions.

## Phase 1: Initial Visual System

- [x] Explore multiple dashboard Idea-card directions.
- [x] Approve the **Signal edge** direction at `/_experiments/idea-card-6/`.
- [x] Approve a light-first, cool-paper visual system.
- [x] Define the cobalt, amber, rust, and neutral semantic palette.
- [x] Define Manrope for headings and DM Sans for body and controls.
- [x] Define initial spacing, radius, border, elevation, focus, and motion rules.
- [x] Create `DESIGN.md`.
- [x] Record the approved visual direction in `docs/DECISIONS.md`.

### Completion checkpoint

- [x] The approved tokens and Idea-card behavior are documented for reuse.

## Phase 2: Your Ideas Page

- [x] Build the global top bar with Groundwork, credits, and profile controls.
- [x] Build the **Your ideas** page heading and **New idea** action.
- [x] Build the inline new-Idea composer.
- [x] Use typed mock Idea data behind a separate data module.
- [x] Integrate the approved Signal edge card as the production Idea card.
- [x] Show one emphasized current action and two quiet secondary stages.
- [x] Support active, ready, unread, available, running, locked, complete, and failed card states.
- [x] Pair semantic color with action copy, icons, or disabled semantics.
- [x] Keep verdict and last-updated metadata out of the collapsed card.
- [x] Preserve rename and delete prototype interactions.
- [x] Provide loading, empty, and recoverable error views.
- [x] Verify the page at desktop and mobile widths.
- [x] Verify keyboard-readable labels, native disabled controls, and visible focus treatment.
- [x] Verify the build and confirm there are no browser console errors.

### Deferred until backend integration

- [ ] Replace prototype toasts with real route navigation.
- [ ] Load Ideas from the backend rather than mock data.
- [ ] Persist create, rename, and delete actions.
- [ ] Connect credit balance and profile controls to account data.

### Completion checkpoint

- [x] The mock-data Your Ideas frontend page is complete and approved.
- [ ] The Your Ideas page is connected to production services.

## Phase 3: Shape Conversation and Idea Summary

### Experiment

- [ ] Create `/_experiments/shape-summary/`.
- [ ] Build realistic user and assistant message variants.
- [ ] Design the composer, sending state, retry state, and preserved-draft behavior.
- [ ] Design the desktop floating Idea Summary.
- [ ] Design the mobile summary sheet or focused summary view.
- [ ] Show confirmed, inferred, suggested, unknown, and conflicting field states.
- [ ] Demonstrate summary updates without distracting from the conversation.
- [ ] Demonstrate current-fact questions being deferred to Investigation.
- [ ] Demonstrate the **Review idea** transition.
- [ ] Capture desktop and mobile screenshots.
- [ ] Obtain user approval.
- [ ] Record accepted additions in `DESIGN.md` and `docs/DECISIONS.md`.

### Integration

- [ ] Build the `/ideas/:ideaId/shape` page with typed mock data.
- [ ] Restore the conversation and draft after reload in the prototype data layer.
- [ ] Remove the composer and make the transcript read-only for frozen Ideas.
- [ ] Add page-level navigation back to **Your ideas**.
- [ ] Verify keyboard navigation, long messages, narrow screens, and reduced motion.

### Completion checkpoint

- [ ] A user can shape a mock Idea from the first message through review readiness.

## Phase 4: Production Frontend Foundation

- [ ] Review and select the production frontend stack.
- [ ] Define the folder, routing, component, and data-service architecture.
- [ ] Convert shared design tokens into reusable code-level tokens.
- [ ] Create reusable button, icon-button, field, menu, status, skeleton, and feedback components.
- [ ] Define typed Idea, Brief, stage, report, Roadmap, credit, and job contracts.
- [ ] Add a replaceable mock service boundary for every page.
- [ ] Add route-level loading and recoverable error handling.
- [ ] Add automated formatting, linting, type checking, and tests.
- [ ] Migrate the approved Your Ideas and Shape surfaces without changing their accepted design.

### Completion checkpoint

- [ ] New pages can be assembled from shared components and typed contracts without duplicating prototype code.

## Phase 5: Confirm Idea

### Experiment and approval

- [ ] Prototype the frozen Idea Brief review layout.
- [ ] Prototype editing for fields that are still allowed to change.
- [ ] Prototype confirmed, uncertain, conflicting, and **Investigate this for me** states.
- [ ] Prototype incomplete-but-allowed confirmation behavior.
- [ ] Prototype the Investigation credit confirmation area without inventing final prices.
- [ ] Capture desktop and mobile screenshots and obtain approval.
- [ ] Update `DESIGN.md` and the decision/specification files if approval changes behavior.

### Integration

- [ ] Build `/ideas/:ideaId/confirm`.
- [ ] Preserve edits when a recoverable request fails.
- [ ] Prevent duplicate paid-action submissions.
- [ ] Freeze the Brief only when Investigation starts.

### Completion checkpoint

- [ ] A user can review a mock Brief, resolve or defer uncertainties, and explicitly start Investigation.

## Phase 6: Credits and Purchase Context

- [ ] Resolve exact credit costs, pack sizes, prices, and introductory-credit policy.
- [ ] Record the approved commercial decisions.
- [ ] Prototype the general `/credits` page.
- [ ] Prototype contextual purchase for Investigation and Roadmap.
- [ ] Clearly separate one-run purchase from better-value credit packs.
- [ ] Show insufficient balance, pending purchase, success, cancellation, and failure states.
- [ ] Confirm that the backend, never AI output, owns prices and product identifiers.
- [ ] Obtain desktop and mobile approval.
- [ ] Integrate the mock-data Credits page.

### Completion checkpoint

- [ ] The frontend can explain and simulate every credit decision without accidental charges or ambiguous pricing.

## Phase 7: Investigation Progress

- [ ] Prototype genuine research stages without a fake percentage.
- [ ] Show reserved credits while research is running.
- [ ] Show background-safe navigation away from the page.
- [ ] Show ready, failed, retryable, and credits-released outcomes.
- [ ] Verify duplicate actions cannot create duplicate visible jobs.
- [ ] Obtain desktop and mobile approval.
- [ ] Build `/ideas/:ideaId/investigation/progress` with typed mock jobs.

### Completion checkpoint

- [ ] Every Investigation job state has a clear status, next action, and credit outcome.

## Phase 8: Investigation Report

### Component experiments

- [ ] Prototype and approve the verdict header.
- [ ] Prototype and approve competitor cards and the detail drawer.
- [ ] Prototype and approve the risk visualization.
- [ ] Define the visual treatment for evidence quality and uncertainty.
- [ ] Define complete, partial, insufficient-evidence, and not-applicable section states.
- [ ] Define controlled generic insight blocks for approved optional sections.

### Page integration

- [ ] Build `/ideas/:ideaId/investigation`.
- [ ] Render fixed core sections and approved playbook modules from typed data.
- [ ] Ensure unknown component types fail safely.
- [ ] Add the consolidated collapsed sources section.
- [ ] Add competitor detail behavior without comparison selection.
- [ ] Add **Report an issue** feedback without automatic regeneration or refund.
- [ ] Test long evidence, missing optional fields, empty arrays, and malformed mock responses.
- [ ] Verify long-form readability and mobile navigation.

### Completion checkpoint

- [ ] A complete mock Investigation can be read, understood, and acted on without unsupported precision or broken states.

## Phase 9: Roadmap Progress

- [ ] Reuse the proven background-job status vocabulary where appropriate.
- [ ] Show credit reservation, generation stages, ready state, failure, retry, and credit release.
- [ ] Obtain desktop and mobile approval.
- [ ] Build `/ideas/:ideaId/roadmap/progress` with typed mock jobs.

### Completion checkpoint

- [ ] Every Roadmap generation state has a clear status and recovery path.

## Phase 10: Roadmap and Clarification Chat

### Experiment and approval

- [ ] Prototype and approve the Gantt-inspired milestone overview.
- [ ] Prototype up to three pre-build validation experiments.
- [ ] Prototype three to five detailed phases.
- [ ] Prototype recommended path, objective, actions, milestone, and primary risk presentation.
- [ ] Prototype the clarification chat and its no-internet boundary messaging.
- [ ] Define the handoff from a clarification request to a paid new-research action.
- [ ] Obtain desktop and mobile approval.

### Integration

- [ ] Build `/ideas/:ideaId/roadmap`.
- [ ] Compute milestone geometry in the frontend rather than accepting AI-controlled coordinates.
- [ ] Omit unsupported optional fields without empty UI.
- [ ] Preserve the stored Roadmap when clarification advice changes.
- [ ] Test long phases, zero experiments, and narrow screens.

### Completion checkpoint

- [ ] A user can understand the broad path ahead and clarify it without turning Groundwork into project-management software.

## Phase 11: Complete Frontend Journey

- [ ] Connect every mock route into one navigable journey.
- [ ] Verify back navigation and Idea context on every page.
- [ ] Verify editable Ideas and frozen Ideas behave differently.
- [ ] Verify a material change creates a new Idea instead of mutating a frozen one.
- [ ] Verify every paid action requires explicit confirmation.
- [ ] Verify loading, empty, partial, unavailable, locked, running, ready, failed, and retry states across the product.
- [ ] Run a keyboard-only pass across every core workflow.
- [ ] Run desktop and mobile visual regression checks.
- [ ] Run WCAG 2.2 AA contrast and accessible-name checks.
- [ ] Test reduced motion, zoom, long text, and missing data.

### Completion checkpoint

- [ ] The entire product journey works as a high-fidelity frontend prototype with replaceable mock services.

## Phase 12: Backend and AI Implementation

### Core platform

- [ ] Finalize authentication and onboarding timing.
- [ ] Define the database and immutable Idea model.
- [ ] Implement Idea creation, rename, deletion, lineage, and freezing.
- [ ] Implement the credit ledger, reservation, consumption, release, and idempotency rules.
- [ ] Integrate the payment provider after commercial decisions are locked.
- [ ] Implement background jobs and recoverable job state.
- [ ] Decide notification delivery.

### AI system

- [ ] Select models for Shape, research, synthesis, verification, Roadmap, and chat.
- [ ] Finalize versioned structured schemas.
- [ ] Implement Shape without internet tools.
- [ ] Implement Investigation with live research and untrusted-web-content defenses.
- [ ] Implement evidence normalization and internal claim-to-source mapping.
- [ ] Implement validation, targeted repair, retry, and quality gates.
- [ ] Consume reserved credits only after the Investigation passes validation.
- [ ] Implement Roadmap generation from the frozen Brief and completed Investigation.
- [ ] Implement Roadmap clarification chat without internet tools or credit consumption.

### Completion checkpoint

- [ ] The frontend uses real services while preserving all approved contracts and states.

## Phase 13: Quality, Security, and Release

- [ ] Define final MVP acceptance criteria.
- [ ] Create AI evaluation datasets and hallucination/citation tests.
- [ ] Add prompt and schema versioning.
- [ ] Add product analytics and success metrics.
- [ ] Add observability for jobs, AI calls, credit events, and failures.
- [ ] Complete privacy, retention, deletion, and disclaimer decisions.
- [ ] Test authorization and cross-account data isolation.
- [ ] Test duplicate submissions and payment/job idempotency.
- [ ] Test browser compatibility and responsive devices.
- [ ] Run an end-to-end release candidate review.
- [ ] Prepare deployment, monitoring, rollback, and support procedures.

### Completion checkpoint

- [ ] Groundwork meets the approved MVP acceptance criteria and is ready for controlled release.

## Immediate Next Action

- [ ] Build `/_experiments/shape-summary/` with desktop and mobile variants, then present it for approval before integrating the Shape page.
