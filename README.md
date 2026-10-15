# Groundwork

Stress-test a startup idea before spending months building it.

Groundwork's planned journey is **Shape**, a free cofounder conversation; **Investigation**, paid research using current evidence; and **Roadmap**, a concise plan with contextual follow-up chat.

## Current implementation

This repository contains a frontend prototype built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix, and Zod.

- The marketing page, Your Ideas dashboard, Shape workflow, and Investigation Progress are implemented.
- Product interactions use typed fixtures and a replaceable mock service with browser-local persistence. Shape responses, research jobs, and credit movements are simulated.
- Investigation Report designs are available as experiments and still require review before product integration.
- Credit purchasing, the production Investigation Report, Roadmap, authentication, payments, live AI, and backend infrastructure remain future work.

The full delivery checklist is in [BUILD_PLAN.md](BUILD_PLAN.md).

## Local setup

Use **Node.js 22.12 or newer within Node 22**, and **npm 10**. `.nvmrc` selects the Node major version; `package-lock.json` locks dependencies. If your Node version manager supports `.nvmrc`, run `nvm use` in the repository.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

No API keys or backend services are needed. Optionally copy `.env.example` to `.env.local` to set `NEXT_PUBLIC_SITE_URL`, the public origin used for metadata and social previews. Its default is `http://localhost:3000`. Set the deployed origin when hosting is configured. Local environment files and credential files are ignored by Git; variables beginning with `NEXT_PUBLIC_` are public browser configuration.

The build downloads Google Fonts and needs network access to the font provider.

## Useful routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing page |
| `/ideas` | Your Ideas dashboard |
| `/idea/shape/new` | Start an Idea |
| `/idea/shape/:ideaId` | Shape conversation or frozen transcript |
| `/idea/investigate/:ideaId/progress` | Simulated research progress and recovery |
| `/credits` | Placeholder for future credit purchasing |
| `/_experiments` | Design experiment directory |
| `/_experiments/investigation-report` | First Investigation Report concept |
| `/_experiments/investigation-report-2` | Alternative Investigation Report concept |

Experiments are review surfaces and must be approved before product integration. They are currently included in builds; production access restrictions remain part of deployment preparation.

## Checks and commands

Run the complete check before committing code:

```sh
npm run check
npm audit --audit-level=high
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build after building |
| `npm run lint` | Check formatting, imports, and lint rules with Biome |
| `npm run format` | Format source files |
| `npm run typecheck` | Generate Next.js route types, then run TypeScript |
| `npm test` | Run the contract and product-service unit tests |
| `npm run check` | Run lint, types, tests, and the production build |

Next.js generates `next-env.d.ts` and `.next/`; these are not committed. Type checking generates the required files automatically, including on a fresh checkout.

[GitHub Actions](.github/workflows/ci.yml) runs the checks and dependency audit on pushes, pull requests, and manual dispatch. It uses read-only repository permissions and pinned action commits. Deployment is configured separately after a hosting provider is selected.

## Repository guide

| Path | Contents |
| --- | --- |
| `app/` | Marketing, product, and experiment routes |
| `components/` | Shared and feature-specific UI |
| `lib/contracts/` | Runtime schemas and TypeScript contracts |
| `lib/fixtures/` | Prototype data |
| `lib/services/` | Mock service boundary for future backend integration |
| `styles/` | Shared and product visual styles |
| `tests/unit/` | Contract and service tests |
| `artifacts/` | Committed desktop and mobile design review screenshots |
| `_experiments/` | Historical standalone design studies |

Start with [AGENTS.md](AGENTS.md) and [HANDOFF.md](HANDOFF.md) before changing product behavior. The remaining sources of truth are [PRODUCT.md](PRODUCT.md), [the product specification](docs/PRODUCT_SPEC.md), [AI behavior](docs/AI_BEHAVIOR.md), [the decision log](docs/DECISIONS.md), and [page specifications](docs/pages/README.md). [ARCHITECTURE.md](ARCHITECTURE.md) defines code boundaries and [DESIGN.md](DESIGN.md) records approved visual directions.

Keep product data behind `ProductService`, preserve runtime validation and frozen Ideas, and follow the documented approval workflow for visual changes. Commit focused checkpoints and keep generated output and local credentials out of version control.
