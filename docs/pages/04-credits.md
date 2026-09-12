# Page: Credits

## Purpose

Credits lets users understand their available balance and purchase enough credit for Investigation, Roadmap generation, or future paid research. It supports both general purchasing and a contextual return to a specific paid action.

## Suggested Route

- General: `/credits`
- Contextual: `/credits?for=:action&idea=:ideaId`

## Entry Points

- Credit balance in the global top bar
- **Add credits and investigate** from Confirm Idea
- Insufficient-credit state when building a Roadmap
- Insufficient-credit state for another paid follow-up analysis

## Required Data

- Current balance
- Available credit packages
- Contextual action, if any
- Credits required for that action
- Return destination
- Purchase state
- Payment success or failure state

Exact quantities and currency prices remain undecided. Prototype values must be stored as mock configuration, not scattered through components.

## Page Contents

### General mode

- Heading explaining credits
- Current balance
- One low-commitment package suitable for one Investigation
- Larger packages with better per-credit value
- Plain explanation of what commonly consumes credits
- Back to Your Ideas

### Contextual mode

In addition to the package choices, show:

- Idea title
- Intended action, such as Full Investigation or Build Roadmap
- Credits required
- Current balance and shortfall
- What happens after purchase
- Return or cancel action

Do not reveal a preliminary verdict while selling Investigation.

## Package Information

Each package may show:

- Package name
- Credit quantity
- Price
- Simple description of likely use
- Purchase action

The backend will ultimately own names, quantities, eligibility, discounts, and prices. The prototype uses configuration data.

## Interactions

### Buy credits in general mode

1. Select a package.
2. Simulate or open the payment step.
3. On success, update the visible balance.
4. Remain on Credits or return to Your Ideas.

A general purchase must not automatically spend credits.

### Buy and start a contextual action

Only use automatic continuation when the button explicitly states the result, for example:

- **Buy credits and start investigation**
- **Buy credits and build roadmap**

After simulated success:

1. Add credits.
2. Reserve the required amount.
3. Create the intended idempotent job.
4. Open the correct progress page.

### Cancel

Return to the originating Idea and preserve all prepared state.

## Page States

### Loading

Show balance and package skeletons. Do not temporarily display a zero balance.

### Purchase pending

Disable repeated submission and show which package is being purchased.

### Success

Show the updated balance and continue according to whether the purchase was general or contextual.

### Payment failed or cancelled

- Preserve the selected package and originating context.
- Do not change the balance.
- Offer retry and return.

### Package unavailable

Disable the affected package with a clear explanation while leaving other packages usable.

## Mobile Behavior

- Stack packages vertically.
- Keep contextual action and shortfall visible before package selection.
- Do not use a wide comparison table.

## Prototype Scenarios

1. General purchase with an existing balance
2. Investigation purchase with insufficient credits
3. Roadmap purchase with insufficient credits
4. Pending payment
5. Successful payment and automatic continuation
6. Failed payment

## Out of Scope

- Real payment-provider integration
- Final prices and package quantities
- Subscription plans
- Coupons or referral programs
- Detailed transaction history unless later approved

