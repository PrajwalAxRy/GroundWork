# Groundwork Design System

Status: Product UI baseline approved through 2026-09-16. The **Your Ideas** and **Shape** directions are integrated and locked unless the user explicitly reopens them. Their source experiments are `/_experiments/idea-card-6/`, `/_experiments/shape-conversation`, and `/_experiments/shape-conversation_cards`.

## Design Intent

Groundwork is a light-first, calm research workspace for people making consequential decisions about early startup ideas. It should feel precise and quietly confident during focused daytime use on a laptop, while remaining clear on a phone.

Premium quality comes from hierarchy, compact information design, readable typography, restrained color, and explicit states. Avoid decorative AI styling, generic card grids, excessive elevation, glass effects, and gamified scores.

The product has two complementary spatial modes:

- **Overview mode** uses the cool canvas, subtle field lines, and a centered content column to help users scan Ideas and identify the next action.
- **Focused work mode** uses a cleaner paper surface, a compact Idea-level utility bar, and a primary working area so the interface recedes behind the task.

Do not force every page into the dashboard composition. Preserve the shared shell, type, color, controls, and state vocabulary while allowing each workflow to use the layout that best supports its job.

## Visual Language

The visual metaphor is a working research surface: cool paper, fine field lines, concise annotations, and a narrow signal that identifies the state requiring attention. Field-research references must remain subtle and functional.

Use a restrained color strategy. Cobalt identifies primary actions and active or ready states. Amber identifies work in progress. Rust identifies failure or destructive actions. Every semantic color must be paired with text, an icon, or another non-color cue.

Use familiar Lucide-style outline icons. Icons clarify navigation, state, or action; they are not decoration. In particular, use a conversation symbol for the Shape welcome state rather than a generic sparkle or magic symbol.

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
- Shape supporting cards use shallower elevation: `0 8px 20px oklch(0.255 0.028 242 / 0.065)` for Working summary and `0 5px 14px oklch(0.255 0.028 242 / 0.045)` for Captured details.
- Use 1-pixel cool-blue rules for structure.
- Use varied spacing to establish rhythm. Dense controls may use 6 to 10 pixel gaps; card regions use 18 to 20 pixels; page sections use 36 to 64 pixels.
- Avoid nested card styling. Secondary stage controls are quiet controls inside the entity card, not additional raised cards.

## Global Shell

The authenticated top bar is 68 pixels tall on desktop and 60 pixels on mobile. It contains only the Groundwork logo, credit balance, and profile control. Use a paper surface, a single bottom rule, and sticky positioning. The logo returns to **Your Ideas**.

The dashboard content width is at most 1040 pixels. The default desktop page padding is 64 pixels above and 96 pixels below. The background may use a very low-contrast 28-pixel horizontal field-line pattern.

Idea-stage pages add a separate page-level utility bar below the global shell. It contains the back route, Idea identity, stage label, and only the status or utility controls relevant to that page. This bar must remain visually secondary to the global shell and must not grow into a sidebar or application-wide navigation system.

## Your Ideas

Status: approved and integrated.

**Your Ideas** is an overview and re-entry surface, not a metrics dashboard. It uses the cool canvas and low-contrast horizontal field lines to create a calm working-set view.

### Page composition

- Use one centered column with a maximum width of 1040 pixels.
- Open with a small cobalt kicker, a large **Your ideas** title, one short explanatory sentence, and the **New idea** primary action aligned opposite the heading on desktop.
- Follow the heading with a quiet list summary: Idea count on the left, sorting context on the right, and one dark rule beneath.
- Render Ideas as a single-column stack of wide cards with an 18-pixel gap. Do not introduce summary metrics, category tiles, or a second dashboard rail.
- Keep **New idea** as the only strong page-level action. Card-level current actions may be emphasized, but secondary stage controls and overflow actions remain quiet.

### Responsive behavior

- At 720 pixels and below, reduce the outer page padding and allow the heading and action to share a compact two-column header.
- Keep the title prominent at approximately 42 pixels rather than shrinking it into a standard toolbar heading.
- Hide nonessential list metadata such as the sort label.
- Reflow each Idea card structurally: the body spans the full card width, secondary stages stack at lower left, and the current action occupies a compact lower-right block.
- Allow titles to wrap and clamp the Brief to two lines. Preserve the same order of attention: status and Idea, prior stages, current action.

### Supporting states

- Loading uses skeleton cards shaped like the final Signal edge cards.
- The empty state teaches what kind of rough thought can become an Idea; it must not feel like an error or a promotional hero.
- Load failures appear as an inline feedback surface with a direct retry action. Existing Ideas are described as unchanged.
- Rename stays inline within the card. Delete requires explicit confirmation.

## Idea Card: Signal Edge

The production Idea card is the approved Signal edge pattern from `/_experiments/idea-card-6/`.

### Anatomy

1. A 6-pixel inset signal rail identifies the current semantic state.
2. The body shows a short status notice, one-line title, and one-line Brief on desktop.
3. Two quiet secondary stage controls show stage name, action label, and a numbered or semantic marker.
4. One emphasized focus control shows the single best current action.
5. An overflow control contains rename and delete actions.

The card is not a single click target. Each enabled stage is a separate button. The collapsed card does not render verdict or last-updated metadata, though those values remain available for sorting and report context.

### Desktop

- Minimum height: 146 pixels.
- Grid: flexible body, 280-pixel secondary-stage region, 170-pixel focus action.
- Gap: 20 pixels.
- Title: 19 pixels, single line with ellipsis.
- Brief: 13 pixels, single line with ellipsis.
- Focus action: at least 82 pixels high.

### Mobile

At 720 pixels and below, the body spans the card width. The two secondary stages stack in the lower-left region and the focus action occupies a 125-pixel lower-right region. Titles wrap naturally and Briefs clamp to two lines. The information hierarchy remains body, history, current action.

### State Treatment

| State | Rail and notice | Marker or icon | Focus treatment |
|---|---|---|---|
| Current, ready, unread, available | Cobalt | Number or arrow | Pale cobalt with explicit action copy |
| Completed | Neutral ink | Checkmark | Quiet unless it is the only remaining destination |
| Running | Amber | Spinner plus status text | Pale amber |
| Locked | Neutral muted | Lock icon and disabled semantics | Never chosen as the focus action |
| Failed | Rust | Warning icon plus recovery copy | Pale rust |

The focus selection is deterministic. Prioritize unread, running, failed, ready, active, then available. If no action state exists, use the last stage as the revisit destination.

## Interaction and Motion

- Use visible 3-pixel cobalt focus rings with a 3-pixel offset.
- Hover states change background or tone without moving layout.
- Button press may move down by 1 pixel.
- Most future transitions should complete within 150 to 250 milliseconds and communicate state.
- Running indicators may rotate. Respect `prefers-reduced-motion` and reduce non-essential animation to effectively zero.
- Loading pages use skeletons shaped like the final content.

## Shape

Status: approved, integrated, and visually complete as of 2026-09-16.

The approved Shape direction is the conversation-first workspace from `/_experiments/shape-conversation`, with the **Quiet details** supporting-card treatment selected as card 11 in `/_experiments/shape-conversation_cards`.

Shape is a focused working surface, not a dashboard and not a form disguised as chat. Its canvas is plain paper without the dashboard field-line pattern.

### Page composition

- Place a 72-pixel Idea utility bar beneath the global shell on desktop. It contains **Your ideas**, a divider, the Idea icon and identity, the **Shape** stage label, and quiet draft, saved, or reset controls where applicable.
- Use a desktop grid with a flexible conversation region and a 300 to 340-pixel supporting-card column. Keep the inter-column gap between 16 and 24 pixels.
- Keep the conversation and persistent composer as the primary surface. The supporting cards are embedded aids, not a full-height side panel.
- Keep **Review idea** inside the composer. It is secondary to sending a message and becomes available when there is conversation content.

### New-Idea welcome state

- Center a compact welcome composition within the conversation region, with a pale-cobalt conversation icon, a clear **Start discussing your idea** heading, short explanatory copy, and three starter prompts.
- Starter prompts are familiar bordered controls, not decorative feature cards. On mobile they become one-column rows.
- State the no-internet boundary in one quiet line below the prompts.
- Do not use fake Idea content in the supporting cards. Working summary reads **Continue chatting to update this summary.** Captured details reads **Continue chatting to capture details.** Both lines use muted text.

### Progressed conversation

- Keep the readable transcript column at approximately 760 pixels.
- Separate days with a small centered label and quiet horizontal rules.
- User messages use one soft neutral bubble. Groundwork responses remain open on the paper surface with a small pale-cobalt avatar, avoiding a stack of competing chat bubbles.
- Message labels are compact and semibold. Body copy uses 15-pixel text with generous line height.
- The assistant contributes one useful observation or challenge and asks one main question at a time; the visual treatment should support that measured cadence.

### Composer

- Keep the composer sticky at the bottom of the conversation region and no wider than the transcript.
- Use a 14-pixel radius, a defined cool-blue border, and a soft shadow. A cobalt focus ring appears only during input focus.
- The textarea is visually open within the surface. Supporting guidance is quiet and may disappear on small screens.
- Keep **Review idea** and Send together at the lower right. Send is the compact cobalt primary control; disabled states use neutral rules and muted ink.

### Supporting Idea Brief

- Use two embedded cards rather than a dedicated side panel: **Working summary** is always visible and **Captured details** is collapsed by default.
- The Working summary card uses a 14-pixel radius, a defined cool-blue border, the stronger of the two restrained shadows, a pale-cobalt layered icon, a compact uppercase label, and one readable paragraph. Do not show update timestamps or waiting-status metadata in this compact card.
- Captured details uses the same 14-pixel shape and icon vocabulary with a quieter shadow so the summary remains primary. Its expanded populated view is a plain label-and-value list with sentence-case bold labels, 13-pixel values, comfortable line height, and no count, preview text, status icons, or row dividers.
- Structured provenance remains part of the data model but is not exposed as field controls in the compact supporting cards or the lightweight review modal. Users correct Groundwork through conversation.

### Review idea modal

- The compact modal already integrated into Shape is the approved direction.
- Show **Review your idea**, one sentence explaining that the user is checking Groundwork's understanding, and the current Idea summary.
- Keep the modal intentionally small. Do not expand it into a field editor, status-management form, research-scope panel, or paid confirmation surface.
- Use **Looks right** as the primary action and **Keep shaping** as the secondary action. The standard close control also returns to Shape.
- On mobile, preserve the same compact hierarchy with comfortable inset spacing and reachable actions rather than turning the modal into a long full-screen form.
- After **Looks right**, retain the transcript and supporting cards in a read-only state. Replace the composer, in the same conversation-column position, with one pale-cobalt **Ready to investigate** handoff card.
- The handoff card contains a short explanation, the accepted summary, and adjacent **Continue shaping** and **Start investigation** actions. It is a focused transition surface, not another dashboard card or a purchase confirmation.
- **Continue shaping** restores the normal composer. Permanent freezing occurs only after the separate Investigation-start confirmation.
- **Start investigation** opens a compact confirmation modal. It uses a short title and sentence, then a restrained overview card headed **Your investigation will cover**. The fixed card content is identical for every Idea and arranges four concise topics in two columns: **Customer and demand**, **Competition analysis**, **Business reality**, and **Evidence check**. Follow it with a clear failure-protection note and an explicit action reading **Start investigation** followed by a credit icon and **5**. Do not repeat the global balance or use a separate cost-summary row in this modal. Keep the scope intentionally broad, with no detailed research-question editor or report preview.

### Responsive behavior

- Below 860 pixels, place the supporting cards after the conversation rather than squeezing them beside it.
- Below 620 pixels, compact the utility bar, reduce text labels on icon-led controls, stack the starter prompts, and use 16-pixel horizontal page margins.
- Keep the composer reachable and visually primary. Do not let the supporting cards displace it or obscure messages when the keyboard is open.

## Content and State Rules

- Use direct action labels such as **Continue shaping**, **Read report**, **Build roadmap**, and **Retry research**.
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
