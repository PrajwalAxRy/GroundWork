# Groundwork Design System

Status: Initial visual system approved through 2026-09-16. The approved source experiment is `/_experiments/idea-card-6/`, using the Signal edge card direction.

## Design Intent

Groundwork is a light-first, calm research workspace for people making consequential decisions about early startup ideas. It should feel precise and quietly confident during focused daytime use on a laptop, while remaining clear on a phone.

Premium quality comes from hierarchy, compact information design, readable typography, restrained color, and explicit states. Avoid decorative AI styling, generic card grids, excessive elevation, glass effects, and gamified scores.

## Visual Language

The visual metaphor is a working research surface: cool paper, fine field lines, concise annotations, and a narrow signal that identifies the state requiring attention. Field-research references must remain subtle and functional.

Use a restrained color strategy. Cobalt identifies primary actions and active or ready states. Amber identifies work in progress. Rust identifies failure or destructive actions. Every semantic color must be paired with text, an icon, or another non-color cue.

## Color Tokens

Use OKLCH tokens as the source values.

| Token | Value | Role |
|---|---:|---|
| `canvas` | `oklch(0.963 0.008 235)` | App background |
| `paper` | `oklch(0.992 0.003 235)` | Primary surface |
| `ink` | `oklch(0.255 0.028 242)` | Primary text and strong neutral state |
| `secondary-ink` | `oklch(0.405 0.023 240)` | Supporting copy |
| `muted-ink` | `oklch(0.53 0.018 238)` | Metadata and quiet labels |
| `rules` | `oklch(0.86 0.014 235)` | Borders and separators |
| `soft` | `oklch(0.945 0.009 235)` | Neutral hover and disabled surfaces |
| `cobalt` | `oklch(0.47 0.135 252)` | Primary action and current state |
| `cobalt-hover` | `oklch(0.415 0.132 252)` | Primary hover |
| `pale-cobalt` | `oklch(0.935 0.028 247)` | Current-action background |
| `amber` | `oklch(0.545 0.115 68)` | Running state |
| `pale-amber` | `oklch(0.94 0.035 75)` | Running-state background |
| `rust` | `oklch(0.49 0.14 31)` | Failure and destructive action |
| `pale-rust` | `oklch(0.94 0.028 31)` | Failure background |

Do not use pure black or pure white. Keep inactive surfaces neutral and reserve saturated colors for action and meaning.

## Typography

- Use Manrope at weights 500 to 700 for the brand, page headings, card titles, and other compact headings.
- Use DM Sans at weights 400 to 600 for body copy, controls, labels, and metadata.
- Fall back to `system-ui, sans-serif` if the web fonts are unavailable.
- Use a fixed product hierarchy for controls and content. The large dashboard title may respond between 42 and 64 pixels because it anchors an open page header.
- Keep prose to about 65 to 75 characters per line.
- Use weight, size, and spacing for emphasis. Do not use gradient text.

## Shape, Spacing, and Elevation

- Base radius: 10 pixels for cards and major surfaces.
- Control radius: 7 to 8 pixels.
- Status markers: circular.
- Standard card shadow: `0 12px 32px oklch(0.255 0.028 242 / 0.065)`.
- Use 1-pixel cool-blue rules for structure.
- Use varied spacing to establish rhythm. Dense controls may use 6 to 10 pixel gaps; card regions use 18 to 20 pixels; page sections use 36 to 64 pixels.
- Avoid nested card styling. Secondary stage controls are quiet controls inside the entity card, not additional raised cards.

## Global Shell

The authenticated top bar is 68 pixels tall on desktop and 60 pixels on mobile. It contains only the Groundwork logo, credit balance, and profile control. Use a paper surface, a single bottom rule, and sticky positioning. The profile control uses a quiet neutral surface, dark icon, and visible border rather than a solid dark block.

The dashboard content width is at most 1040 pixels. The default desktop page padding is 64 pixels above and 96 pixels below. The background may use a very low-contrast 28-pixel horizontal field-line pattern.

## Idea Card: Signal Edge

The production Idea card is the approved Signal edge pattern from `/_experiments/idea-card-6/`.

### Anatomy

1. A 6-pixel inset signal rail anchors the card.
2. The body shows a one-line title and one-line Brief on desktop.
3. One emphasized focus control shows **Continue shaping**, **Review idea**, or **View roadmap**.
4. An overflow control contains rename and delete actions.

The card is not a single click target. Each enabled stage is a separate button. The collapsed card does not render verdict or last-updated metadata, though those values remain available for sorting and report context.

### Desktop

- Minimum height: 118 pixels.
- Grid: flexible body and a 180-pixel focus action.
- Gap: 20 pixels.
- Title: 19 pixels, single line with ellipsis.
- Brief: 13 pixels, single line with ellipsis.
- Focus action: at least 58 pixels high.

### Mobile

At 720 pixels and below, the body and action remain side by side while space allows. At 440 pixels and below, the action moves beneath the summary so the title and Brief keep a readable measure. Titles wrap naturally and Briefs clamp to two lines.

### State Treatment

The dashboard uses one pale-cobalt focus treatment with explicit action copy and an arrow. It does not use amber, rust, spinners, failure copy, or stage markers. Those semantic treatments remain available for the detailed progress and recovery pages where the state can be explained and acted on.

## Interaction and Motion

- Use visible 3-pixel cobalt focus rings with a 3-pixel offset.
- Primary button text and card-action text must meet WCAG AA contrast against their resting surfaces.
- Hover states change background or tone without moving layout.
- Button press may move down by 1 pixel.
- Most future transitions should complete within 150 to 250 milliseconds and communicate state.
- Running indicators may rotate. Respect `prefers-reduced-motion` and reduce non-essential animation to effectively zero.
- Loading pages use skeletons shaped like the final content.

## Shape

The previous Shape visual implementation was removed at the user's request on 2026-09-16. There is currently no approved Shape layout, conversation treatment, side brief, composer, or responsive direction in the codebase.

The next Shape design must begin as a new development-only experiment and return for desktop and mobile approval before production integration. The functional requirements in `docs/PRODUCT_SPEC.md`, `docs/AI_BEHAVIOR.md`, and `docs/pages/02-shape.md` remain the starting constraints; the removed visual design must not be treated as an approved reference.

## Content and State Rules

- Dashboard cards use only **Continue shaping**, **Review idea**, and **View roadmap**.
- Missing optional content closes its space naturally.
- Do not show `undefined`, empty labels, repeated `N/A`, or broken placeholders.
- Distinguish not found, not applicable, partial, failed, locked, running, ready, and complete states in both copy and structure.
- Use sentence case throughout the product.

## Accessibility

Target WCAG 2.2 AA. All core interactions must work by keyboard. Icon-only controls require accessible names. Disabled stage controls use native disabled semantics and visible lock cues. Status cannot depend on color alone. Touch targets should be at least 40 pixels where the surrounding layout permits. Dialogs and menus must manage focus correctly when the prototype becomes a production application.

## Extending the System

New page-level components should reuse these tokens and the same control vocabulary. Important or uncertain components still require a development-only experiment route, desktop and mobile screenshots, and user approval before integration. Record approved additions here and in `docs/DECISIONS.md`.

The following remain open for later experiments: long-form report composition, verdict presentation, competitor details, risk visualization, Roadmap overview, and any illustration or generated-media vocabulary.

## Code Ownership and Implementation

The product design system is implemented in `styles/product.css`, reusable controls in `components/ui/product-primitives.tsx`, and the product frame in `components/product/product-shell.tsx`. The marketing surface keeps its separate dark presentation in `styles/obsidian.css`; it does not redefine product semantics.

This repository owns these files and all future design-system changes. The sibling landing-page repository is a read-only reference. `ARCHITECTURE.md` defines the corresponding route, component, and data boundaries.

On the marketing landing page, the dark hero keeps its natural content height. The research-dimension rail closes that dark region and meets the first light band directly, without a dark transition gap. It is intentional for the light section to peek into the initial viewport when space allows.
