# Groundwork Frontend Architecture

Last updated: 2026-09-16

This document defines the production frontend foundation. Product behavior remains governed by `docs/DECISIONS.md`, `docs/PRODUCT_SPEC.md`, and `docs/AI_BEHAVIOR.md`.

## Stack

- Next.js 16 App Router and React 19
- Strict TypeScript
- Tailwind CSS 4 for utility composition, with CSS custom properties for approved product tokens
- Radix primitives for accessible overlays and disclosure controls
- Lucide icons and Motion for purposeful interaction feedback
- Zod at every untrusted data boundary
- Biome for formatting and linting
- Vitest and Testing Library for automated tests

Versions are pinned by `package-lock.json`. The sibling landing-page repository is a read-only visual and dependency reference; this repository owns the Groundwork application and its future files.

## Folder responsibilities

```text
app/
  (site)/                 marketing routes
  (product)/              authenticated-product routes and route states
components/
  landing/                copied and product-aligned marketing surface
  product/                shared product shell
  ideas/ and shape/       feature-owned UI
  ui/                     reusable primitives only
lib/
  contracts/              runtime-validated data contracts
  fixtures/               typed mock responses
  services/               replaceable product service boundary
styles/
  tokens.css              shared marketing tokens
  obsidian.css            marketing surface
  product.css             approved product visual system
tests/unit/               contract and deterministic unit tests
```

Feature components may compose shared primitives, but shared primitives must not import feature code. Pages stay thin: they resolve route parameters and render a feature entry point. Client-side persistence and simulated responses live behind `ProductService`, never inside page components.

## Routes

| Route | Responsibility |
| --- | --- |
| `/` | Groundwork marketing page and new-Idea entry |
| `/ideas` | Your Ideas dashboard |
| `/credits` | Intentional placeholder until commercial decisions are locked |
| `/preview/[slug]` | Marketing media preview |
| `/_experiments/*` | Development-only review surfaces; never a production product path |

Future Idea-stage routes follow `docs/pages/README.md` and live under `app/(product)/idea/<stage>/[ideaId]/`. The `/ideas` collection route remains the dashboard.

The Shape production route and its experiment are intentionally absent. Its contracts, fixtures, and service methods remain available for a future from-scratch rebuild.

## Data and trust boundaries

- `lib/contracts/product.ts` defines Zod schemas and inferred TypeScript types for Ideas, Briefs, stages, reports, Roadmaps, credits, and jobs.
- `ProductService` is the only feature-facing data boundary. The current implementation uses validated fixtures and local storage; a backend adapter can replace it without changing page components.
- The frontend renders only known report block types. Unknown or invalid payloads fail validation and must become an intentional unavailable or recoverable state.
- The backend will own credit prices, product identifiers, idempotency, and state transitions. The mock layer does not invent commercial values.
- Shape and Roadmap clarification never call internet tools. Investigation is the only live-research stage.

## UI and state handling

- Shared tokens and primitives implement `DESIGN.md`; feature styles may extend them without redefining semantic colors.
- Every implemented product route owns a loading state. Recoverable client failures preserve user input and render inline feedback.
- Missing data is explicit. It must not result in an empty broken component.
- Important new visual directions begin at `/_experiments/<component>` and are integrated only after approval.

## Required checks

Run `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before a coherent frontend change is committed. Verify affected routes in a browser at desktop and mobile widths.
