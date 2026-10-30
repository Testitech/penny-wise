# Pennywise

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Young adults who find traditional budgeting overwhelming and want to understand everyday spending, upcoming expenses, and manageable money habits. Visitors evaluate the fictional product through a landing page and a working financial example.

## Product Purpose

Help people understand their money and make their next decision with more confidence. The current project's goal is to demonstrate the concept and build waitlist interest, without collecting personal information or creating real signups.

## Positioning

Bring current balance and upcoming commitments into one understandable plan. Demonstrate the effect of an ordinary extra expense before a visitor makes a decision. This is the confirmed product mechanism; a defensible competitive distinction has not been established.

## Operating Context

The current experience is a responsive public landing page. Visitors can read the product explanation, explore a local money-plan example, inspect spending and habit summaries, expand explanations, and try the waitlist form. It is not an authenticated finance application.

## Capabilities and Constraints

- All financial data, dates, and habit progress are fictional. The example uses USD; this does not establish a target country or launch currency.
- Default example: $1,240 balance minus $640 commitments leaves $600 after those commitments. Including an $80 bike repair changes commitments to $720 and remaining money to $520. These are demonstration values, not actual user finances or a complete forecast.
- The Hero and expense example share local state. Monetary totals derive from integer minor-unit values in src/data/money-plan.ts. Past spending is already reflected in the balance and is not subtracted again.
- The waitlist is a frontend demonstration. Validate the email locally, clear it on success, and explicitly state that no real signup was created. Never transmit or persist email addresses.
- No backend, bank connection, financial-information request, payments, authentication, or account management is in scope.
- Pricing, business model, launch date, deployment target, real signup service, and geographic market are undecided. Do not invent them.

## Brand Commitments

The product name is Pennywise. Its message is “Understand your money. Make your next move with confidence.” Use warm, clear, encouraging language without judgment or financial jargon.

The user has approved the existing identity, six custom editorial illustrations, and a supplied SaaS layout reference, including a split navy Hero. Detailed visual specifications belong in the existing design.md and implementation; this product record does not replace them.

## Evidence on Hand

- Working local financial demonstration: src/components/DashboardPreview.tsx, src/components/ExpenseShowcase.tsx, and src/data/money-plan.ts.
- Fictional spending and habit data: src/data/spending.ts.
- Six custom generated illustrations: assets/illustrations/. Inventory and generation provenance: assets/README.md and assets/prompts.md.
- Local-only form behavior: src/components/WaitlistForm.tsx.
- No verified customers, testimonials, partner logos, customer counts, performance benchmarks, or business metrics. Do not fabricate proof or imply that example data belongs to real users.

## Product Principles

1. Make the effect of a next expense understandable through consistent, visible arithmetic.
2. Encourage small useful habits without moralizing about spending.
3. Clearly distinguish a fictional demonstration from an actual financial service or signup.
4. Keep visitor information local and preserve the privacy constraints.
5. Prefer evidence from working behavior over unsupported claims.

## Accessibility & Inclusion

Preserve keyboard navigation, visible focus, semantic headings, descriptive image alternatives, labeled form fields, validation and success announcements, and reduced-motion behavior. Keep financial figures and controls in accessible HTML rather than embedding them in illustrations. Verify responsive behavior at 1440px, 768px, and 390px. No additional product-specific accessibility standard or locale requirement has been confirmed.
