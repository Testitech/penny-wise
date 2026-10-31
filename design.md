# Pennywise design specification

## Authority and status

This is the implementation source of truth consolidated from `AGENTS.md`, `.taste-skill/direction.json`, `.taste-skill/decision-report.md`, `.taste-skill/app/direction.json`, and `.taste-skill/app/decision-report.md`. Decision reports govern wherever manual adaptations differ from generated suggestions. Generated JSON remains provenance, not a resolved implementation theme.

Fixed: marketing direction `product-performs` (seed 1680499291), app style `achromatic-ledger` (seed 1613878171), the documented adaptations, and the privacy constraints below. Provisional: exact palette applications, font rendering, contrast, responsive fit, and unprovided sample details. Validate these before implementation; do not silently introduce another direction or feature. No rendered design or accessibility check has yet passed.

Apply explicit user requirements and applicable house rules first. For marketing, then follow direction, typography/palette, hero, and section geometry. For interface fragments, follow preserved brand roles, selected app-style specifications, shell/screen geometry, then shared defaults. Manual report decisions override the generated typography-tool hero, pinning, account management, and unsupported content.

## Product identity and principles

Pennywise is a fictional personal finance app for young adults who find traditional budgeting overwhelming. Its landing page's primary goal is waitlist interest, demonstrated locally without collecting data.

Core message: **“Understand your money. Make your next move with confidence.”** Hero headline: **“Understand your money.”** Describe the app concretely in supporting copy and preserve the confidence message in the page narrative.

Tone is warm, trustworthy, modern, clear, encouraging, and free of financial jargon or judgment. The concept is **“Your next move, made visible.”** Prove value through readable product fragments and consistent financial arithmetic. Use flat surfaces, aligned figures, restrained color, equal margins, and content-sized sections. Warmth comes from language and approachable presentation, not decorative clutter. Each section must make a claim and show its evidence.

## Typography

Use **Schibsted Grotesk** throughout, with `system-ui, sans-serif` fallback. No Geist or Geist Mono. Marketing display uses 800; body uses 400; navigation and functional emphasis use 600. App text uses 400, with 600 for functional emphasis and money; reserve 800 for marketing display. Use sentence case, never decorative capitalization or a differently styled headline word.

Marketing display settings are tight tracking around -0.05em and compact leading around 0.88, subject to collision and legibility checks. Follow the direction's modest 4–6vw headline scale rather than the superseded 96–150px typography-tool hero. Keep every heading to two lines or fewer; choose responsive bounds through measurement, not shrinking an unreadable headline to pass.

The generated marketing scale provides small 13–14px, body 17–19px, lead 20–26px, and section headings 32–64px, using fluid sizing. Marketing body copy must never fall below 16px. Body leading is approximately 1.4–1.6, with readable paragraph measures. Interface fragments use their separate fixed app scale:

| App role | Size |
| --- | --- |
| Title | 24px |
| Section label | 16px |
| Principal money figure | 30px |
| Body | 14px |
| Secondary detail | 12px |

Use tabular numerals and right-align monetary columns. Verify that the loaded font supports the required figures; do not silently substitute another family. Do not apply marketing display tracking/leading to small interface text.

## Color and semantic roles

Preserve the **Navy on white** palette provisionally. Centralize roles as CSS custom properties and expose them through Tailwind; do not scatter raw hex values through components.

| Semantic role | Effective value and application |
| --- | --- |
| Page/app ground | #FFFFFF |
| Panel surface | #F4F4F2 |
| Raised app surface | #FFFFFF |
| Primary ink | #1F2B4D |
| Secondary ink | #6A7186; validate on every surface used |
| Brand/data accent | #F7941D; a small meaningful mark, not broad orange panels |
| Text on accent | #1F2B4D; validate before use |
| Primary app control | #05070A with #FFFFFF text |
| Optional marketing dark field | #05070A with #FFFFFF text |
| Optional marketing warm-grey field | #E3E1DC with #1F2B4D text |
| App chart roles | #1F2B4D main, #8A8A8A neutral comparison, #F7941D small emphasis |
| App border / row rule / control edge | #E6E6E6 / #F0F0F0 / #D4D4D4, provisional functional neutrals |

The app report explicitly reverses the generated app ground/surface arrangement: grey panels on white. Navy ink is the approved exception to literal achromatic styling. The app JSON's blue #1D5FBF, black text, Geist weights, and native accent do not override these decisions. Its semantic green/red/amber tokens are unused in this overview; any later use needs an explicit reason and contrast check. Omit all native status-pill pairs. Do not make ordinary spending red or remaining money green by default.

Keep app navigation and controls quiet; no orange primary button or tinted KPI tiles. Aim for the ledger's under-1% colored-pixel budget, using color on meaningful data. Marketing accent remains sparse, never a large decorative shape. Marketing surface separation uses tone or space; fine structural borders are allowed inside actual controls, tables, and `data-ui` interface fragments.

## Spacing, radii, and responsive bands

Use one coherent grid and equal outer margins across navigation and sections. Mobile margins are 16px; marketing outer margins may grow to 32px on desktop. Avoid half-empty sections and viewport-height padding. Marketing section gaps can use the skill's 120–240px desktop and 72–112px phone ranges only where content justifies them; shorten gaps that create blank stretches. Footer spacing is ordinary content spacing, not 20–30svh of emptiness.

App dimensions are fixed decisions: **12px peer-panel gap, 24px panel padding, 8px card radius, 6px control radius, 44px minimum data-row height**, sparse density. Wrapped rows grow naturally. The generated 24px panel gaps and 61px rows are superseded. Desktop controls may be 36px tall; mobile interactive targets must be at least 44px. Do not carry over the removed 306px accounts column or reserve its space.

Responsive bands are provisional implementation defaults, not previously validated composition measurements: phone through 640px, tablet 641–1100px, desktop above 1100px. Check actual content fit rather than relying on Tailwind's default breakpoint names. Stack paired content earlier if it becomes unreadable. Verify at 390px, 768px, and 1440px, plus 320px and intermediate widths for overflow and wrapping. The phone is a separately composed layout, not a scaled-down desktop screenshot.

## Landing-page order and layout

1. **Navigation and hero.** Plain Pennywise wordmark, real section links, and one primary waitlist action. Left-aligned headline and concrete supporting copy beside a large money-plan fragment on a neutral stage. Keep the action visible on the first screen. No overlapping controls, shaped-stage motif, browser frame, or deliberately empty bottom third. On phone, lead with copy and action, then the readable plan.
2. **Product showcase.** Retain `showcase-one-row-three-states`: show one fictional expense row before selection, selected for the plan, and reflected in the resulting calculation. These are planning states, not a payment or bank action. The middle example uses the same local demonstration logic. Keep rows at readable size and preserve essential amounts on mobile; no artificial empty flank.
3. **Three benefits.** Adapt `features-small-proof-beside-text` into exactly spending clarity, upcoming expense planning, and healthier habits. Pair each explanation with a distinct interface crop. Keep consistent text alignment and vary fragment size naturally; no invented fourth capability or icon-card grid. Stack panels and explanations on mobile.
4. **How it works.** Use the adapted `how-it-works-run-in-column`: one continuous sequence about reviewing spending, accounting for upcoming expenses, and choosing a manageable habit, with compact evidence. Keep it visually different from benefit modules. No sticky fragment, viewport-height stages, scroll locking, or concealed content.
5. **Final waitlist CTA.** Retain the sentence-with-a-blank concept with a real labelled email field and “Join waitlist” button. Make the section's purpose visible; a placeholder is not a label. Stack the field and action on mobile as needed. Keep the text readable and the form functional rather than forcing literal display-size geometry.
6. **Quiet footer.** Pennywise name or short description, working section anchors, and a fictional-product/demo notice. No location, live clock, invented email address, social profiles, or dead privacy link. Stack naturally on mobile.

Use one h1, descriptive section headings, and logical document order. Headings must not exceed two lines at supported widths. Product fragments are the primary imagery: the hero plus three meaningful detail crops provide substance without stock photography. `data-ui` belongs on actual interface fragment roots, never the entire marketing page.

## Dashboard preview and fictional data

Title: **Money plan**. Primary question: **What remains after my upcoming commitments?** One main panel leads with:

**$1,240 balance − $640 upcoming commitments = $600 remaining after those commitments.**

These are fictional USD values. Clearly label a consistent fictional snapshot date and commitment period. The $600 is after the displayed commitments, not a full forecast or an assurance that all of it is safe to spend.

Keep the 30px remaining figure dominant and its inputs adjacent. Place dated commitment rows directly below, summing to $640. Follow with compact spending evidence and one modest habit example. Supporting panels may share a desktop row; on mobile show balance, commitments, remaining, commitment details, then supporting evidence. No pinned column, account tree, net worth, account switching, per-day allowance, or account-management actions. Preserve the open-plane shell's quiet treatment without inventing app routes or user furniture. Any visible navigation must lead to actual preview content.

The source artifacts do not establish individual bill names, dates, transaction rows, or alternate preset amounts. Treat those as fictional implementation content requiring review, not preapproved product facts. Every total must derive from its displayed rows; store money in integer minor units and format consistently. Past spending explains the current balance and must not be subtracted again. Repeated values use one source of truth.

The sole product demonstration interaction selects a preset upcoming expense and recalculates commitments and remaining money locally. No free-form financial inputs, backend, payment action, or persistence. Selection must clearly mean included in this illustrative plan, not paid or canceled. The default rendered state must retain the exact equation above. An optional proportional bar must use the same data and labelled values; do not add charts solely for decoration. Preserve a complete readable default when scripting is unavailable.

## Waitlist demonstration behavior

Use a visible email label, an email input, and a consistently named “Join waitlist” submit button. Hero actions may link to the final form. State before submission that this is a demonstration and addresses are not submitted or saved.

Validate a nonempty, syntactically valid email on the frontend using native email validity and accessible inline feedback. Invalid submission keeps the field available, identifies the problem in text, and associates the message with the input. Valid submission prevents navigation/network submission, clears the entered address, and displays a local success message explaining that no actual signup occurred. Announce the state accessibly; do not imply an email was sent or a waitlist record exists.

Keep the address only transiently in the active form. No server actions, API requests, mailto, analytics payloads, logs, cookies, local/session storage, or URL parameters containing it. Reloading resets the demo. With scripting unavailable, do not permit a fallback form navigation that transmits the address; present the demo limitation instead.

## Accessibility, motion, and validation

Use semantic landmarks, real links/buttons, associated labels, clear focus indicators, and accessible names. Preset controls work with keyboard and touch, expose selection state, and never require hover or dragging alone. Announce a changed result concisely without moving focus unexpectedly. Avoid focus traps; any navigation disclosure supports Escape and returns focus to its trigger.

Validate normal text contrast at least 4.5:1, large text and meaningful graphical marks at least 3:1, including secondary ink on grey panels and focus states. Do not assume orange or comparison grey passes against white. Reinforce orange marks with navy labels/outlines and verify the actual treatment; color alone never communicates state. Decorative neutral borders cannot substitute for a distinguishable interactive boundary. Contrast adjustments require a documented role-specific resolution, not a new palette.

Check mobile touch targets of at least 44px, target spacing, keyboard order, readable figures, row expansion, 200% zoom, and horizontal overflow. None of these checks is complete. Do not hide an essential input or amount merely to fit a crop.

Retain the selected masked-headline motion as restrained progressive enhancement. Content and the primary action must be present immediately; no loader or animation gate. Other entrances and control feedback use transform/opacity and do not change reading order. Reduced motion removes travel and scroll effects, preserving all information. No motion may reintroduce pinning or distract from financial meaning. Exact timings and the final motion treatment require visual validation.

## Implementation guidance and prohibitions

Use Next.js App Router with TypeScript and Tailwind CSS. Put routes/layout/global styles in `src/app/`, focused PascalCase components in `src/components/`, shared fictional data in `src/data/`, and static assets in `public/`. Use two-space indentation, typed props, camelCase variables, semantic HTML, and centralized role-based theme values. Keep static page content server-rendered; isolate client state to the preset demonstration, waitlist form, and any necessary disclosure.

When setup is authorized, define dev, build, start, and lint scripts and use the package manager selected by the committed lockfile. No testing framework or coverage threshold currently exists. Verify arithmetic, selection updates, invalid/valid form behavior, no submission/persistence, keyboard access, mobile layout, reduced motion, lint, and production build. Tests added later use `*.test.tsx` or `*.spec.ts` according to their actual runner. Never claim browser or Taste checks that were not run.

Do not invent testimonials, customers, user counts, press logos, integrations, security certifications, account linking, payment tools, imports, automation, search/command menus, or other unsupported features. No unnecessary pinning, scroll hijacking, gradients, glass, resting shadows, decorative badges, floating pill navigation, emoji furniture, rainbow charts, KPI icon tiles, or fake grey-bar dashboards. Do not turn generated reference-site details into Pennywise claims. Every visual and interaction must strengthen financial clarity or the waitlist journey.

This document authorizes no application implementation, package installation, asset download, or modification of the Taste provenance artifacts.

## October 2026 redesign: getdesign.md blend

The user requested a Productivity & SaaS reference blended into the existing page. The downloaded independent Notion analysis is preserved at `notion/DESIGN.md` (via getdesign.md's official CLI). This section supersedes earlier conflicting geometry and button specifications.

Keep Schibsted Grotesk, navy #1f2b4d, orange #f7941d, the existing core headline, fictional arithmetic, shared expense toggle, and frontend-only waitlist. Adopt the reference's paper #f6f5f4 surfaces, rounded interface panels, pill marketing actions, tightly tracked display type, and centered 1200px content measure. The hero centers its message above a large working product fragment; the navy money panel makes the balance equation the visual anchor. Alternate the feature compositions and use one navy explanation band.

Idea: Pennywise's money remaining after commitments becomes the live answer at the heart of the page. The bike-repair toggle changes both previews from $600 to $520. No invented testimonials or customer counts. No external photography is used because the product's four readable interface fragments provide the evidence.

Argument and copy: Understand your money → working plan; See the next move → optional expense and its result; Money, made clearer → spending, commitments, weekly habit; A little clarity → practical explanation; Your next move starts here → clearly disclosed waitlist demonstration.

## Approved custom illustration refresh

The user approved six editorial ink illustrations below the Hero. Final originals and prompts are organized in assets/; the component imports source PNGs and uses Next.js Image optimization. This supersedes the prior statement that no generated artwork is used.

Preserve the Hero, dashboard, typography, palette and interaction. Below it, the bicycle scene sits beside a live repair example; spending, upcoming bills and habit scenes alternate around compact HTML summaries; a planning-desk scene sits in a white inset within the navy explanation band; an invitation scene precedes the waitlist heading. Financial amounts, dates and progress remain accessible HTML. All six assets share navy contours, orange accents, paper fills and print grain. No stock photos or fictional proof claims are added.

## User-selected SaaS layout reference

The user supplied a screenshot of a SaaS page and explicitly approved changing the Hero to its split navy composition. This supersedes all earlier Hero-preservation and section-geometry requirements. Keep Schibsted Grotesk, Pennywise navy/orange, custom editorial artwork, the live expense example, and the frontend-only form.

Reference mappings: sculpted navy navigation and rounded split Hero -> Pennywise message and live dashboard; the logo strip is omitted because Pennywise has no verified partners; pale proof band with staggered tiles -> actual fictional $80 repair, commitments and remaining calculations; three pricing cards -> spending, commitments and habit summaries without invented paid plans; feature rows -> native keyboard-accessible disclosure elements; dark lower product area -> local waitlist demonstration. Navy surfaces use #0d1428, supported by brand ink #1f2b4d and orange #f7941d. Artwork remains unchanged. No gradients or stock portraits are required to carry the composition.


## Polish and distill pass

The approved reference layout and six generated illustrations remain. The previous critique's three priority issues are resolved: the money-plan entry targets the control's region, with a nearby remaining figure on smaller screens and enough preceding context on desktop; the signup actions explicitly identify a waitlist demonstration; the explanation rows teach the example's balance, commitments and repair calculation rather than repeating the benefit cards.

The middle loses redundant subtitles and a repeated primary button. Missing and malformed email errors give distinct recovery instructions. Tablet decision tiles reflow into three readable columns and the financial summaries use horizontal cards; phone illustration heights are reduced without cropping. The complete example, optional expense toggle, keyboard disclosures, privacy behavior and every original visual asset remain available.

## Next Move Check and navigation refinement

The separate `/next-move-check` feature follows `docs/features/next-move-check.md` for product behavior. It uses the established Schibsted type and navy/paper palette, with round white form panels, capsule controls, and a navy result panel to give the estimate clear visual priority. Inputs have a restrained navy focus indicator. The cost-removal action is a bold, dark-red label on a light red surface; clear and reset actions have distinct neutral/navy treatments. Result color does not carry the financial meaning alone.

On the landing page, the middle navigation links sit in a complete navy pill separated from the rounded Hero. The Hero's Next Move Check link and the check page's return link read as outlined capsule actions without underlines. The landing page's fictional USD example remains separate from the user-entered NGN check.
