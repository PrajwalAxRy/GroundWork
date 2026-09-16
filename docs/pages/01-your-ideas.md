# Page: Your Ideas

## Purpose

The dashboard is the user's home in Groundwork. It lets users create an Idea, understand the state of every existing Idea, and enter the correct stage without a separate overview page.

## Suggested Route

`/ideas`

## Entry Points

- Groundwork logo in the global top bar
- Successful sign-in, once authentication is implemented
- Back-to-Ideas action from an Idea page
- Completion or cancellation of a page-level flow

## Required Data

- Current credit balance
- List of Ideas sorted by most recently updated
- For each Idea:
  - Identifier
  - Title
  - Short Brief
  - Shape state
  - Investigation state
  - Roadmap state
  - Optional verdict retained for report context but not rendered on the collapsed card
  - Last updated time
  - Whether any result is newly ready or unread

If an AI-generated title or Brief is temporarily missing, use the user's first message as a temporary title or preview.

## Page Contents

### Global top bar

- Groundwork logo
- Credit balance
- Profile control

### Page header

- Heading: **Your ideas**
- Primary button: **New idea**

### New-Idea entry

Selecting **New idea** opens the dedicated Shape start route at `/idea/shape/new`.

The Shape start page will contain:

- Short prompt asking what the user is thinking about building
- Multiline or expanding text input
- Primary button: **Start shaping**
- A route back to **Your ideas**
- Two or three example Idea starters may be shown as inspiration

Do not create an Idea until the user submits non-empty content.

### Idea cards

Use a single-column stack of wide cards.

Use the approved **Signal edge** direction from `/_experiments/idea-card-6/`: a slim semantic state rail, a compact body, two quiet secondary stage controls, and one emphasized current action.

Each card contains:

- Idea title
- Short Brief, limited to approximately two lines in the collapsed card
- Shape control
- Investigate control
- Roadmap control
- Overflow menu

The whole card is not clickable because the stage controls have different destinations.

Do not render verdict or last-updated metadata on the collapsed card.

## Stage-Control Behavior

### Shape

- Editable Idea: **Continue shaping**
- Ready for confirmation: **Review idea**
- Frozen Idea: Completed, opens the read-only Shape transcript

### Investigate

- Before review: Locked
- Ready to purchase: **Start investigation**
- Running: **View research progress**
- Completed and unread: **Report ready**
- Completed and viewed: **Open investigation**
- Failed: **Retry research** or open the failed progress state

### Roadmap

- Before Investigation completes: Locked
- Available after report: **Build roadmap**
- Running: **View roadmap progress**
- Completed: **Open roadmap**
- Failed: Open the failed Roadmap progress state

## Interactions

### Create an Idea

1. Select **New idea**.
2. Enter the initial thought on the dedicated Shape page.
3. Select **Start shaping**.
4. Create the Idea and open Shape with the initial message already submitted.

### Open a stage

Selecting a stage control opens its relevant page or state. Locked controls do nothing and explain the prerequisite through visible supporting text or an accessible tooltip.

### Rename

The overflow menu contains **Rename**. Renaming changes only the dashboard title, not the frozen Brief or purchased content.

### Delete

The overflow menu contains **Delete**. Show a confirmation explaining that the Idea, chat, report, and Roadmap are affected. The prototype only needs to demonstrate this confirmation and resulting card removal. Production retention and recovery rules remain undecided.

### Credits

Selecting the credit balance opens the Credits page in general purchase mode.

### Profile

Selecting Profile opens a compact account menu. Detailed settings and authentication behavior are outside the current prototype scope.

## Page States

### Empty

- Keep **New idea** available as the primary route into Shape.
- Explain what type of starting message is sufficient.
- Do not show an empty card grid.

### Loading

- Show skeletons representing the page heading and several Idea cards.

### Populated

- Show all Ideas in one list, without separate Continue and Earlier sections.

### Failed to load

- Show a clear retry action.
- Do not display an empty state that implies the user has no Ideas.

### Many Ideas

- Continue the single-column list.
- Search, filtering, grouping, and pagination are not required in the first prototype.

## Mobile Behavior

- Maintain the compact global top bar.
- Place **New idea** in the page header.
- Stack Idea cards vertically.
- Allow stage controls to wrap without losing their state labels.
- Keep overflow actions keyboard and touch accessible.

## Prototype Scenarios

Create mock cards demonstrating:

1. Shape active, later stages locked
2. Brief ready for confirmation
3. Investigation running
4. Investigation report ready
5. Roadmap available but not generated
6. Roadmap complete
7. Research failed with credits restored

## Out of Scope

- Dashboard analytics
- Continue and Earlier grouping
- Multi-column card grid
- Public sharing
- Bulk actions
- Search and filtering in the first prototype
