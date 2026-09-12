# Groundwork Handoff

Last updated: 2026-09-11

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
- Hidden Idea Brief and Summary card
- Idea confirmation screen
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

The recommended sequence is:

1. Approve the visual direction.
2. Create `DESIGN.md` with the accepted visual system.
3. Build a high-fidelity frontend prototype using typed mock data.
4. Prototype important components at development-only routes and obtain user approval.
5. Assemble the complete responsive product journey.
6. Test happy paths, missing data, failures, locked states, and mobile behavior.
7. Design and implement the backend against the same frontend data contracts.

The frontend prototype should be reusable production-oriented code, not a disposable mockup. The initial backend, AI providers, database, authentication, payments, and background jobs do not need to be selected before prototyping.

## Immediate Next Topic

Continue with Groundwork's visual direction.

The direction proposed at the end of the previous discussion was:

- Light-first
- Calm modern research workspace
- Quietly confident
- Highly readable for long-form analysis
- Restrained color rather than flashy AI styling
- Premium through typography, spacing, hierarchy, and interaction quality
- Subtle survey, terrain, or field-research details used sparingly

This is the recommended starting direction, not a completed visual system. The next discussion should test two or three distinct variations within this direction, approve one, and then create `DESIGN.md`.

## Important Prototype Requirements

- Use realistic typed mock data that can later be replaced by real API responses.
- Include complete, partial, insufficient-evidence, not-applicable, loading, locked, running, ready, and failed states.
- Validate important components at desktop and mobile sizes.
- Use development-only experiment routes such as `/_experiments/idea-card` before integration.
- Show the user screenshots and obtain approval for material visual decisions.
- Do not rush from the first acceptable design into full implementation.

## Still Undecided

The following are intentionally open and should not be mistaken for missing documentation:

- Final theme, palette, typography, spacing, elevation, and motion tokens
- Exact frontend stack and location of the existing landing-page project
- Exact credit amounts, package prices, and introductory-credit policy
- Authentication and onboarding timing
- Completion notification channels
- AI model selection and exact structured schemas
- Research orchestration and background-job infrastructure
- Database, payments, hosting, privacy policy, and retention rules
- Evaluation thresholds, analytics, and final MVP acceptance criteria

Consult `docs/DECISIONS.md` for the complete open-decision list.

## Repository State

At the time of this handoff, this workspace contains the product documentation but not the landing-page or product frontend source code. Before implementation, locate the existing code or explicitly scaffold a new frontend here.

## Suggested Prompt for the New Chat

> Read `AGENTS.md` and `HANDOFF.md`, then read every source-of-truth document they reference. Do not reopen locked product decisions. Continue from the immediate next topic: propose two or three strong visual directions for the Groundwork product UI within the agreed quietly confident, light-first research-workspace direction. We want to complete a high-fidelity frontend prototype with mock data before building the backend.
