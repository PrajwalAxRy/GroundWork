# Groundwork Handoff

Last updated: 2026-10-15

## Purpose of This File

This is the starting point for a new chat or coding agent. It records where product discovery stopped, which decisions are already final, and what should happen next.

Do not treat this as a replacement for the detailed specifications. Read the source-of-truth files listed below before proposing or building product behavior.

## Required Reading

Read in this order:

1. `AGENTS.md`
2. `PRODUCT.md`
3. `docs/PRODUCT_SPEC.md`
4. `docs/AI_BEHAVIOR.md`
5. `docs/DECISIONS.md`
6. `docs/pages/README.md` and the relevant page specification for prototype work
7. `BUILD_PLAN.md` for the current delivery checklist

Do not ask the user to repeat or rediscover decisions recorded in those files.

## Product Summary

Groundwork helps aspiring founders stress-test a startup Idea before spending months building it.

The product has three stages:

1. **Shape:** Free, direct but constructive AI cofounder conversation. No internet access.
2. **Investigation:** Paid live-internet research presented as a concise interactive report.
3. **Roadmap:** Paid overview of the journey ahead, with free contextual follow-up chat and no internet access.

Each confirmed Idea is immutable once Investigation starts. A material variation, new geography, or new analysis is treated as a separate Idea.

## Product Discovery Status

The following have been discussed and recorded in detail:

- Audience, positioning, and commercial intent
- Shape conversation behavior
- Hidden Idea Brief requirements
- In-Shape Idea Brief review modal
- Brief freezing and read-only Shape history
- Investigation purchase and credit reservation
- Background research progress
- Investigation report content and interactions
- Controlled optional AI sections
- Missing-data and failure behavior
- Competitor cards and detail behavior
- Consolidated sources section
- Report issue feedback
- Roadmap scope and structure
- Gantt-inspired milestone overview
- Free Roadmap clarification chat
- Product shell and Your Ideas dashboard
- Idea cards and stage states
- Human approval through development-only experiment routes
- Explicit MVP exclusions
- Page-by-page functional prototype specifications

These topics should not be reopened unless the user explicitly requests a change.

## Current Delivery Strategy

The detailed, trackable delivery sequence is maintained in `BUILD_PLAN.md`. Keep its checkboxes current as work is implemented, verified, and approved.

The high-level sequence is:

1. Use the approved Signal edge direction and the initial tokens in `DESIGN.md`.
2. Build the remaining high-fidelity frontend prototype using typed mock data.
3. Prototype important components at development-only routes and obtain user approval.
4. Assemble the complete responsive product journey.
5. Test happy paths, missing data, failures, locked states, and mobile behavior.
6. Design and implement the backend against the same frontend data contracts.

The frontend prototype should be reusable production-oriented code, not a disposable mockup. The initial backend, AI providers, database, authentication, payments, and background jobs do not need to be selected before prototyping.

## Immediate Next Topic

The initial visual system and dashboard Idea card are approved and integrated on the production frontend foundation. The production card uses the **Signal edge** direction from `/_experiments/idea-card-6/`.

The Shape UI design is approved and fully integrated at `/idea/shape/new` and `/idea/shape/:ideaId`. Treat this direction as locked unless the user explicitly reopens it. It uses the conversation-first workspace from `/_experiments/shape-conversation` and the **Quiet details** treatment selected as card 11 in `/_experiments/shape-conversation_cards`: Working summary stays visible, Captured details is collapsed by default, and Review idea remains in the composer. Existing-Idea loading, persisted drafts, frozen transcripts, response failure and retry, and research-deferral behavior now run through the mock product-service boundary.

The lightweight **Review your idea** modal, paused-review handoff, and paid Investigation confirmation are approved, integrated, and fixed. Do not redesign them unless the user explicitly reopens the decision. **Review your idea** shows the current Idea summary with **Looks right** and **Keep shaping**. Selecting **Looks right** persists the accepted-summary snapshot and pauses Shape for review: transcript and supporting cards become read-only, and the composer is replaced by a **Ready to investigate** card containing the accepted summary, **Continue shaping**, and **Start investigation**. Continuing Shape invalidates the accepted snapshot. **Start investigation** opens the compact fixed-content confirmation modal; the service reserves credits idempotently and permanently freezes Shape only after that operation succeeds. Its overview uses the four locked topics: **Customer and demand**, **Competition analysis**, **Business reality**, and **Evidence check**.

The Investigation Progress direction from `/_experiments/investigation-progress` is approved and integrated at `/idea/investigate/:ideaId/progress`. It uses a familiar tracking-page composition with one status lead, one continuous six-phase progress surface, and a compact credit-outcome footer. The user explicitly removed the activity-count panel. Running, ready, failed, retry, status-loading failure, and credit-release behavior run through typed mock jobs and the product-service boundary. Dashboard running and failed actions open this route, and a successful paid Investigation confirmation in Shape navigates to it.

Two full-page Investigation Report concepts now exist at `/_experiments/investigation-report` and `/_experiments/investigation-report-2`. Review those experiments and obtain approval for the report direction and its components before integrating `/idea/investigate/:ideaId`. Phase 8 of `BUILD_PLAN.md` still tracks the outstanding approval, missing-data, interaction, and integration work.

## Important Prototype Requirements

- Use realistic typed mock data that can later be replaced by real API responses.
- Include complete, partial, insufficient-evidence, not-applicable, loading, locked, running, ready, and failed states.
- Validate important components at desktop and mobile sizes.
- Use development-only experiment routes such as `/_experiments/idea-card` before integration.
- Show the user screenshots and obtain approval for material visual decisions.
- Do not rush from the first acceptable design into full implementation.

## Still Undecided

The following are intentionally open and should not be mistaken for missing documentation:

- Exact credit amounts, package prices, and introductory-credit policy
- Authentication and onboarding timing
- Completion notification channels
- AI model selection and exact structured schemas
- Research orchestration and background-job infrastructure
- Database, payments, hosting, privacy policy, and retention rules
- Evaluation thresholds, analytics, and final MVP acceptance criteria

Consult `docs/DECISIONS.md` for the complete open-decision list.

## Repository State

This repository is now the canonical Groundwork application. It uses a Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, Radix primitives, Zod contracts, Biome, and Vitest. The copied marketing surface, integrated Your Ideas experience, local mock-service boundary, approved Idea-card experiment, complete mock service-backed Shape workflow, and approved service-backed Investigation Progress route live here. `ARCHITECTURE.md` defines the production frontend boundaries. The sibling landing-page folder remains an untouched reference and is not the application workspace.

`README.md` documents setup, implemented routes, prototype limitations, and validation. Use Node.js 22.12 or newer within Node 22 and npm 10, install with `npm ci`, and run `npm run check` plus `npm audit --audit-level=high` before pushing. Type checking generates Next.js route types automatically; generated Next.js files, environment files, local credentials, logs, and temporary output are ignored. The GitHub Actions workflow runs the same checks.

The GitHub repository is [PrajwalAxRy/GroundWork](https://github.com/PrajwalAxRy/GroundWork), approved as public. `main` is the default branch and `origin` uses HTTPS. Preserve the full existing commit history.

## Suggested Prompt for the New Chat

> Read `AGENTS.md` and `HANDOFF.md`, then read every source-of-truth document they reference, including `DESIGN.md` and `BUILD_PLAN.md`. Do not rebuild Shape until the user explicitly asks to begin its from-scratch design process.
