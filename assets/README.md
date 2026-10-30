# Pennywise visual assets

The project-level asset library contains final custom illustrations and their generation record. Next.js imports originals directly through `src/components/Illustration.tsx`; its image optimizer serves responsive derivatives. Do not duplicate these files under public/.

| Original | Section | Description |
| --- | --- | --- |
| illustrations/spending.png | See where it goes | Hands sorting receipts with groceries, coffee and transport ticket; suite style reference |
| illustrations/next-move.png | Make room for real life | Bicycle, repair tools, expense slip |
| illustrations/upcoming-bills.png | Plan a little ahead | Calendar and bill envelopes |
| illustrations/weekly-habit.png | Keep a small habit | Notebook with three checked boxes and one open box |
| illustrations/money-process.png | How it works | Receipts, calendar, open notebook and pencil |
| illustrations/waitlist-invitation.png | Waitlist | Hand placing invitation in an envelope |

All six are built-in image-model generations, 1536 × 1024 PNG, created 23 October 2026. See prompts.md for complete prompts and provenance. Navy ink, orange accents, off-white objects, subtle print texture, seamless white ground. No generated text, amounts or dates. Asset filenames use lowercase kebab-case; revisions use -v2 rather than overwriting approved originals.

Keep artwork at a 3:2 ratio using contain, never crop important objects. Keep financial information in semantic HTML and provide descriptive alt text. The Hero has no generated illustration: it shows the working money plan in the user-approved split navy layout.
