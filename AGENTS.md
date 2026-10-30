# Repository Guidelines

## Autonomy & Follow-Through

Proactively complete actions within the user's approved scope, including implementation, logic checks, verification, testing, debugging, and necessary follow-through. Do not stop merely to offer work you can already perform. Pause only for a real blocker, required permission, or an explicit user-requested approval or review checkpoint.

## Project Status & Scope

Pennywise is a Next.js, TypeScript, and Tailwind CSS landing page for a fictional personal finance app aimed at young adults. Its primary goal is waitlist interest. The page includes a working financial example and a frontend-only waitlist demonstration. No automated testing framework is configured.

## Project Structure & Module Organization

When scaffolding, use the Next.js App Router with `src/app/` for routes, layouts, and global styles. Place reusable UI in `src/components/`, fictional dashboard data in `src/data/`, and static assets in `public/`. Keep section components focused, using names such as `Hero.tsx`, `DashboardPreview.tsx`, and `WaitlistForm.tsx`. Colocate component tests with their source; reserve `tests/` for end-to-end scenarios.

## Build, Test, and Development Commands

Use the scripts defined in package.json:

- `npm run dev`: start the local development server.
- `npm run build`: generate and validate the production build.
- `npm run start`: serve the production build locally.
- `npm run lint`: run the configured ESLint checks.

Use npm, matching package-lock.json. Add test commands only when their tooling exists.

## Visual Asset Library

`assets/` is the project-level source library for landing-page visuals. Store final image-model originals in `assets/illustrations/`, document their section mapping and dimensions in `assets/README.md`, and preserve generation prompts and provenance in `assets/prompts.md`. Use lowercase kebab-case filenames and version suffixes for future replacements. Do not edit assets inside `.agents/skills/` or duplicate originals in `public/`.

Render originals through the shared `Illustration` component and Next.js Image static imports for intrinsic dimensions, responsive sizes, and optimized delivery. Keep financial figures, dates and controls in HTML. Preserve the approved editorial ink style: expressive navy #1f2b4d linework, restrained orange #f7941d, off-white #f6f5f4 objects, subtle paper texture and white backgrounds. Use one image as the style reference for new additions; avoid rendered lettering, amounts, logos, gradients or unrelated ornaments. Review all outputs before integrating.

The user subsequently approved replacing the Hero layout with the supplied SaaS reference's split navy composition. That approval supersedes the earlier Hero preservation requirement. Keep the working money plan and shared expense behavior while using the reference's rounded navy Hero, pale decision band, three financial summary cards, and expandable feature rows. Retain Pennywise's navy/orange identity and the six custom illustrations. Do not copy the reference's invented customer logos, business metrics, pricing, or testimonial proof. Verify at 1440, 768 and 390px; use `npm run lint` and `npm run build` for checks.

## Coding Style & Naming Conventions

Use two-space indentation, TypeScript types for component props, and PascalCase for React component names. Use camelCase for variables and functions. Prefer semantic HTML, Tailwind utility classes, and small reusable components. Keep financial figures consistent across summaries and charts. Follow the configured formatter and ESLint rules once introduced.

## Testing Guidelines

No testing framework or coverage threshold is configured. Verify responsive layouts, keyboard navigation, form validation, and the demonstration success state. Run lint and production build checks once available. If automated tests are added, use `*.test.tsx` for component tests and `*.spec.ts` for browser scenarios; document their runner and commands.

## Commit & Pull Request Guidelines

There is no Git history establishing a convention. Use concise, imperative commit messages, such as `Add responsive dashboard preview`. Pull requests should describe the change, validation performed, and any limitations. Link relevant issues and include desktop and mobile screenshots for visual changes.

## Data & Privacy

Use fictional financial data only. The waitlist is a frontend demonstration: do not transmit or persist email addresses, connect a backend, or request financial information. Clearly communicate the demonstration behavior.
