# Groundwork Page Specifications

Status: Prototype-ready functional specifications. The approved initial visual system is recorded in `DESIGN.md`; page-specific behavior remains in these files.

## Purpose

These files describe what each Groundwork page does, what information it contains, how users interact with it, and which states a frontend prototype must demonstrate.

An AI building the prototype should read, in order:

1. `AGENTS.md`
2. `HANDOFF.md`
3. `PRODUCT.md`
4. `docs/PRODUCT_SPEC.md`
5. `docs/AI_BEHAVIOR.md`
6. `docs/DECISIONS.md`
7. This file
8. The relevant page specification

## Page Index

1. [Your Ideas](01-your-ideas.md)
2. [Shape](02-shape.md)
3. [Review Idea modal](03-confirm-idea.md)
4. [Credits](04-credits.md)
5. [Investigation Progress](05-investigation-progress.md)
6. [Investigation Report](06-investigation-report.md)
7. [Roadmap Progress](07-roadmap-progress.md)
8. [Roadmap](08-roadmap.md)

## Suggested Prototype Routes

These routes are recommendations for a clickable prototype and may be adapted to the selected frontend framework.

| Page | Suggested route |
|---|---|
| Your Ideas | `/ideas` |
| Start a new Idea in Shape | `/idea/shape/new` |
| Shape | `/idea/shape/:ideaId` |
| Credits | `/credits` |
| Contextual credit purchase | `/credits?for=investigation&idea=:ideaId` or `/credits?for=roadmap&idea=:ideaId` |
| Investigation Progress | `/idea/investigate/:ideaId/progress` |
| Investigation Report | `/idea/investigate/:ideaId` |
| Roadmap Progress | `/idea/roadmap/:ideaId/progress` |
| Roadmap | `/idea/roadmap/:ideaId` |

The new-Idea Shape route currently exists as a placeholder. The full Shape experience remains intentionally unimplemented, and its future design must begin with a new experiment.

Important component explorations should also have development-only routes such as:

- `/_experiments/idea-card`
- `/_experiments/verdict-header`
- `/_experiments/competitor-card`
- `/_experiments/risk-matrix`
- `/_experiments/roadmap-overview`

Use `/_experiments` to browse the experiment routes currently available in the application.

## Shared Product Shell

Every authenticated page uses the same global top bar:

- Groundwork logo on the left
- Credit balance on the right
- Profile control on the right

The Groundwork logo returns to **Your Ideas**. Do not add **My Ideas** or **New Idea** to the global top bar.

For pages belonging to one Idea, provide a clear route back to **Your Ideas** and show the Idea title. This page-level navigation must not expand the global top bar into a large application sidebar.

## Shared Stage Semantics

Every Idea has three stages:

1. Shape
2. Investigate
3. Roadmap

Stage controls may be:

- Current action
- Completed and available to revisit
- Available next
- Running
- Ready
- Locked
- Failed

Do not rely on color alone. Use action text, status text, icons, disabled semantics, or progress indicators as appropriate.

## Prototype Data Rules

- Use typed mock data rather than hardcoding prose directly into components.
- Keep mock data behind a replaceable data-service boundary.
- The frontend must render only known component types.
- Optional values may be absent.
- Arrays may be empty.
- Layouts must close missing space naturally.
- Never show `undefined`, empty labels, broken cards, or repeated `N/A` values.
- Distinguish **not found**, **not applicable**, **partial**, and **failed**.
- Use immutable mock Idea objects once their Investigation has started.

## Shared Loading and Error Behavior

- Use skeletons when loading page content.
- Disable repeated submissions while an action is pending.
- Preserve entered user content when a recoverable request fails.
- Give every failed paid action a clear status and recovery route.
- A failed paid generation must visibly indicate that reserved credits were released.

## Shared Responsive Requirements

Every page must be prototyped at desktop and mobile sizes.

- Preserve the same information hierarchy on mobile.
- Convert side panels into focused sheets or separate views when required.
- Do not require hover to access information.
- Keep primary actions reachable without persistent obstructive banners.
- Long data must wrap, truncate with an accessible reveal, or scroll within an appropriate container.

## Not Included Yet

The following remain outside these page specifications because their product behavior has not been decided:

- Sign-up and sign-in pages
- Password recovery
- Full profile or settings page
- Notification center
- Administration and support tools
- Real payment-provider screens
- Final credit quantities and prices
