# Groundwork Handoff

Last updated: 2026-09-16

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

The initial visual system and dashboard Idea card are approved. The production card uses the **Signal edge** direction from `/_experiments/idea-card-6/`. `DESIGN.md` records the light-first cobalt system, typography, spacing, elevation, state semantics, and responsive card behavior.

Continue by exploring the next important or uncertain component on a development-only route. Strong candidates are the Shape conversation and floating Idea Summary because they establish the main working experience beyond the dashboard.

## Important Prototype Requirements

- Use realistic typed mock data that can later be replaced by real API responses.
- Include complete, partial, insufficient-evidence, not-applicable, loading, locked, running, ready, and failed states.
- Validate important components at desktop and mobile sizes.
- Use development-only experiment routes such as `/_experiments/idea-card` before integration.
- Show the user screenshots and obtain approval for material visual decisions.
- Do not rush from the first acceptable design into full implementation.

## Still Undecided

The following are intentionally open and should not be mistaken for missing documentation:

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

This workspace now contains the production-oriented Your Ideas frontend prototype in `src/`, typed mock data in `src/data.js`, the approved Idea-card experiment, and `DESIGN.md`. The prototype remains framework-free and does not yet contain the remaining product pages or backend.

## Suggested Prompt for the New Chat

> Read `AGENTS.md` and `HANDOFF.md`, then read every source-of-truth document they reference, including `DESIGN.md`. Do not reopen locked product decisions. Continue from the immediate next topic by creating a development-only experiment for the Shape conversation and Idea Summary using the approved Groundwork visual system.
