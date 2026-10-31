# Pennywise

Pennywise is an early personal finance concept for young adults who find budgeting overwhelming. This repository contains a responsive landing page, an interactive fictional money-plan example, and a session-only Next Move Check. It does not have accounts or a real waitlist.

The example shows how a possible expense affects the amount left after upcoming commitments. Its figures are fictional and use USD for demonstration. The waitlist form validates an email locally, then clears it; it does not send or store the address or create a signup.

## Run locally

Use Node.js 20.9 or later and npm:

```sh
npm ci
npm run dev
```

Open the local URL printed by Next.js. Use `npm run lint` and `npm run build` to check the project.

Run `npm run test:calc` for calculation tests. For browser interaction tests, install Playwright's Chromium once with `npx playwright install chromium --no-shell`, then run `npm run test:ui`.

## Project notes

- [PRODUCT.md](PRODUCT.md) records the current product scope and constraints.
- [design.md](design.md) records the visual direction and design decisions.
- [assets/README.md](assets/README.md) maps the custom illustrations to page sections.
- [AGENTS.md](AGENTS.md) contains repository conventions for contributors and coding agents.
- [Next Move Check specification](docs/features/next-move-check.md) defines the approved feature behavior and boundaries.

On a new device, clone this repository, run the local setup above, and have Codex read `AGENTS.md`, `PRODUCT.md`, `design.md`, and the approved feature specification before changing product behavior or UI.

Next Move Check accepts whole-naira NGN estimates in the browser, then clears them on refresh. It does not save or transmit entered figures. The landing-page USD example remains fictional; no customer or product performance claims are made here.
