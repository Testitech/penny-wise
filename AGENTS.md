# Repository Guidelines

## Autonomy & Follow-Through

Proactively complete actions within the user's approved scope, including implementation, logic checks, verification, testing, debugging, and necessary follow-through. Do not stop merely to offer work you can already perform. Pause only for a real blocker, required permission, or an explicit user-requested approval or review checkpoint.

## Working Philosophy and Product Ownership

The user owns product decisions. Build in small iterations: make the simplest genuinely useful version, inspect it, learn, and improve it. Start from a specific feature and its user journey, not an application shell or empty screens. Establish functionality, hierarchy, spacing, and usability before decorative polish, while keeping the interface at a credible quality bar. Reuse established components and conventions; introduce shared patterns only when repetition justifies them. For significant product or architectural decisions, explain trade-offs and discuss them with the user before implementation. Preserve approved specifications and design decisions, and challenge unclear requirements instead of inventing scope. These principles are drawn from the user's stated approach to building in public and Refactoring UI; they do not grant permission to publish or share work externally.

## Project Status & Scope

Pennywise is a Next.js, TypeScript, and Tailwind CSS landing page for a personal finance concept aimed at young adults. Its primary landing-page goal is waitlist interest. The page includes a fictional financial example and a frontend-only waitlist demonstration. The separate Next Move Check is specified in `docs/features/next-move-check.md`.

## Project Structure & Module Organization

When scaffolding, use the Next.js App Router with `src/app/` for routes, layouts, and global styles. Place reusable UI in `src/components/`, fictional dashboard data in `src/data/`, and static assets in `public/`. Keep section components focused, using names such as `Hero.tsx`, `DashboardPreview.tsx`, and `WaitlistForm.tsx`. Colocate component tests with their source; reserve `tests/` for end-to-end scenarios.

## Build, Test, and Development Commands

Use the scripts defined in package.json:

- `npm run dev`: start the local development server.
- `npm run build`: generate and validate the production build.
- `npm run start`: serve the production build locally.
- `npm run lint`: run the configured ESLint checks.
- `npm run test:calc`: run pure Next Move Check calculation tests.
- `npm run test:ui`: run Next Move Check browser interaction tests (after `npx playwright install chromium --no-shell`).

Use npm, matching package-lock.json. Add test commands only when their tooling exists.

## Visual Asset Library

`assets/` is the project-level source library for landing-page visuals. Store final image-model originals in `assets/illustrations/`, document their section mapping and dimensions in `assets/README.md`, and preserve generation prompts and provenance in `assets/prompts.md`. Use lowercase kebab-case filenames and version suffixes for future replacements. Do not edit assets inside `.agents/skills/` or duplicate originals in `public/`.

Render originals through the shared `Illustration` component and Next.js Image static imports for intrinsic dimensions, responsive sizes, and optimized delivery. Keep financial figures, dates and controls in HTML. Preserve the approved editorial ink style: expressive navy #1f2b4d linework, restrained orange #f7941d, off-white #f6f5f4 objects, subtle paper texture and white backgrounds. Use one image as the style reference for new additions; avoid rendered lettering, amounts, logos, gradients or unrelated ornaments. Review all outputs before integrating.

The user subsequently approved replacing the Hero layout with the supplied SaaS reference's split navy composition. That approval supersedes the earlier Hero preservation requirement. Keep the working money plan and shared expense behavior while using the reference's rounded navy Hero, pale decision band, three financial summary cards, and expandable feature rows. Retain Pennywise's navy/orange identity and the six custom illustrations. Do not copy the reference's invented customer logos, business metrics, pricing, or testimonial proof. Verify at 1440, 768 and 390px; use `npm run lint` and `npm run build` for checks.

## Coding Style & Naming Conventions

Use two-space indentation, TypeScript types for component props, and PascalCase for React component names. Use camelCase for variables and functions. Prefer semantic HTML, Tailwind utility classes, and small reusable components. Keep financial figures consistent across summaries and charts. Follow the configured formatter and ESLint rules once introduced.

## Testing Guidelines

Node's test runner with `tsx` covers pure calculations; Playwright covers browser interactions. No coverage threshold is configured. Verify responsive layouts, keyboard navigation, form validation, and the demonstration success state. Run lint and production build checks. Colocate pure `*.test.ts` files with their source; reserve `tests/*.spec.ts` for browser scenarios.

## Commit & Pull Request Guidelines

There is no Git history establishing a convention. Use concise, imperative commit messages, such as `Add responsive dashboard preview`. Pull requests should describe the change, validation performed, and any limitations. Link relevant issues and include desktop and mobile screenshots for visual changes.

Do not commit, push, or create a pull request without the user's explicit approval for that action. Treat approval as specific to the request in which it was given.

## Data & Privacy

Use fictional financial data for the landing-page demo. Next Move Check accepts user-entered NGN estimates in local page state only; do not transmit or persist those figures. The waitlist is a frontend demonstration: do not transmit or persist email addresses or connect a backend. Clearly communicate each demonstration's behavior.
