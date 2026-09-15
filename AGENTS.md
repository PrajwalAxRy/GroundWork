# Groundwork Working Instructions

These instructions apply to all work in this repository.

## Required Context

Before proposing, designing, or implementing product behavior, read:

1. `HANDOFF.md`
2. `PRODUCT.md`
3. `docs/PRODUCT_SPEC.md`
4. `docs/AI_BEHAVIOR.md`
5. `docs/DECISIONS.md`
6. `docs/pages/README.md` and the relevant page specification when working on UI

Do not ask the user to rediscover decisions already recorded there.

## Source-of-Truth Order

When information conflicts, use this order:

1. The user's latest explicit instruction
2. Locked decisions in `docs/DECISIONS.md`
3. Detailed behavior in `docs/PRODUCT_SPEC.md`
4. AI guidance in `docs/AI_BEHAVIOR.md`
5. Strategic context in `PRODUCT.md`

## Decision Maintenance

- Treat locked decisions as settled unless the user explicitly reopens them.
- Record newly approved product decisions in `docs/DECISIONS.md`.
- Update `docs/PRODUCT_SPEC.md` when an approved decision changes user-facing behavior.
- Update `docs/AI_BEHAVIOR.md` when an approved decision changes model tools, prompts, schemas, validation, or research behavior.
- Keep unresolved matters under the relevant open-decisions heading.
- Preserve rejected and superseded decisions so they are not accidentally reintroduced.

## Version Control

- When a coherent, verified code change is complete, make a focused Git commit with a clear message unless the user asks to keep changes uncommitted.
- Preserve existing user changes and do not include unrelated files in a commit.

## Product Guardrails

- Shape has no internet access.
- Roadmap clarification chat has no internet access.
- Investigation performs live research and must pass validation before credits are consumed.
- The frontend renders validated structured data, not arbitrary AI-generated UI.
- The backend owns credit prices, product identifiers, and state transitions.
- Missing information must render as an intentional state, never as a broken component.
- Frozen Ideas are read-only. Material changes create a new Idea.

## Browser Interaction

Use the normal Codex browser harness for browser interaction. Require approval before consequential remote actions such as submitting forms, purchasing, posting, deleting, changing account state, or sending messages.

Some Astra skills do not have direct web access. When browser control is needed to build, review, or verify a website, use the normal Codex Work browser harness; do not skip browser-based checks because of that limitation.

## Design Workflow

- Do not rush visual decisions.
- For important or uncertain UI components, build a development-only experiment route such as `/_experiments/<component>`.
- Show the experiment to the user for approval before integrating it into the main product.
- Iterate when rejected, and record the accepted direction.
- Use screenshots at relevant desktop and mobile sizes during visual review.
- Prefer excellent hierarchy and purposeful interaction over decorative complexity.

## Design Documentation

`DESIGN.md` records the approved visual system and component directions. Update it when a new visual direction is approved; keep unapproved explorations in development-only experiment routes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
