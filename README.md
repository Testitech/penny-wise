# Pennywise

Pennywise is an early personal finance concept for young adults who find budgeting overwhelming. This repository currently contains a responsive landing page and an interactive, fictional money-plan example. It does not yet contain a usable finance application or a real waitlist.

The example shows how a possible expense affects the amount left after upcoming commitments. Its figures are fictional and use USD for demonstration. The waitlist form validates an email locally, then clears it; it does not send or store the address or create a signup.

## Run locally

Use Node.js 20.9 or later and npm:

```sh
npm ci
npm run dev
```

Open the local URL printed by Next.js. Use `npm run lint` and `npm run build` to check the project.

## Project notes

- [PRODUCT.md](PRODUCT.md) records the current product scope and constraints.
- [design.md](design.md) records the visual direction and design decisions.
- [assets/README.md](assets/README.md) maps the custom illustrations to page sections.
- [AGENTS.md](AGENTS.md) contains repository conventions for contributors and coding agents.

The first real product feature is still being discussed. The current page is a concept demonstration, and no customer or product performance claims are made here.
