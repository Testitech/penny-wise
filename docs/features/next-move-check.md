# Next Move Check

Status: Approved feature specification and source of truth. An initial implementation exists at `/next-move-check`.

## Problem and intended user

A Nigerian young adult wants to understand what may remain if they make one possible expense while covering costs before their next income. They can reasonably estimate when that income will arrive, even if it is irregular. The check gives an estimate based on their inputs, not an affordability verdict or financial recommendation.

## Core journey and planning period

1. Enter the money available now.
2. Add the unpaid costs expected before the next income, or explicitly confirm there are no costs to add.
3. Optionally enter one possible expense and see how it changes the amount left.
4. Edit or remove costs, change or clear the possible expense, or reset the check.

The user defines the planning period by choosing which costs to include. There is no exact next-income date field. Payments already reflected in the available amount must not be added again as costs.

## Inputs and commitments

- **Money available now:** required, nonnegative, whole-naira NGN amount.
- **Costs to cover:** zero or more individually named, unpaid costs expected before the next income. Each added cost requires a name and a positive whole-naira amount. This includes necessary everyday costs such as groceries or transport as well as bills. The user can add, edit, and remove costs; the first iteration does not calculate due dates or recurrence.
- **No costs to add:** an explicit user choice. An untouched empty list never counts as confirmation of zero costs. Removing the final listed cost requires a fresh confirmation before a result becomes available.
- **Possible expense:** optional single scenario with a positive whole-naira amount when entered; its name is optional. A blank possible expense means no scenario is being tried.

Decimal or kobo amounts are invalid. Reject them with clear guidance, such as “Enter a whole-naira amount, without decimals.” Never silently round entered amounts. Use a single shared NGN formatting rule for every amount displayed by the feature; do not scatter currency formatting across interface elements.

## Calculation and result behavior

1. **Before the possible expense:** money available now − sum of costs to cover = remaining before the possible expense.
2. **After the possible expense, if entered:** that remainder − possible expense = estimated amount left after the expense.

Recalculate when valid inputs change. Clearing the possible expense removes only that scenario; it does not alter the costs. The possible expense is neither recorded as a payment nor added to the costs list.

Show a negative result at either step as **“Short by ₦X”**, where X is the absolute value of the negative result. If commitments alone exceed available money, show that shortfall before any possible expense is entered. A possible expense increases the shortfall accordingly. Show an exactly zero result as **“₦0 remaining”** and never label zero a shortfall. Make both steps and their numerical basis understandable; do not use “safe to spend” or imply certainty.

For example, ₦100,000 available − ₦40,000 in costs − a ₦15,000 possible expense leaves **₦45,000**. With ₦40,000 available and ₦50,000 in costs, the first step is **short by ₦10,000**; adding a ₦5,000 possible expense makes the second step **short by ₦15,000**. If the subtraction equals zero, show **₦0 remaining**.

Place this limitation beside the result: **“Based only on what you entered. Other spending, pending charges, and changes in income are not included.”** The result is an estimate, not an affordability judgment.

If any required or entered input becomes invalid or incomplete, make the **ready result** unavailable immediately. A newly added, unfinished cost may instead show a clearly labelled **live, in-progress estimate** based on current valid amounts: exclude a blank draft amount and say so; include a valid draft amount even if its name is still missing and say so. Do not show this preview before at least one cost amount has been entered, or when any entered amount is invalid, another cost is incomplete, or a calculation exceeds safe-integer limits. A cost that was previously complete and later becomes incomplete does not qualify as a new draft. Never leave a previously calculated amount visible as though it is current. Restore the ready result only after the issue is corrected or the incomplete cost or possible expense is removed or cleared.

## Essential interface states

- **Untouched:** explain what to enter; display no calculated result.
- **Incomplete:** identify missing required information, including an unconfirmed empty costs list or an incomplete added cost. A newly added draft may show the qualified live estimate described above; otherwise display no calculated result.
- **Invalid:** explain the affected field and how to fix it, including decimal inputs; display no calculated result.
- **Ready with costs:** show the before-expense calculation from valid available money and at least one valid cost.
- **Ready with no costs:** show the before-expense calculation only after the user explicitly confirms no costs to add.
- **Possible expense entered:** show both calculation steps and update them for valid changes.
- **Exactly zero remaining:** state ₦0 remaining, distinct from a shortfall.
- **Shortfall:** state the amount short before or after the possible expense, as applicable.

Reset returns to the untouched state and clears all entered figures and the no-cost confirmation. Inputs and results remain in the current session only and clear on refresh.

## Validation and accessibility

- Require a nonnegative whole-naira available amount and positive whole-naira amounts for each cost and any entered possible expense. Reject malformed, decimal, or incomplete amounts rather than coercing or rounding them.
- Require a name for each added cost. An incomplete added cost blocks the ready result until corrected or removed; only a newly added draft can show the qualified live estimate described above. An invalid possible expense blocks results until corrected or cleared.
- Associate specific, understandable errors with their fields. Do not show stale calculations during an error.
- Provide visible labels and focus states. Adding, editing, removing, confirming no costs, clearing an expense, and resetting must all work by keyboard.
- Make errors and results available to screen readers without announcing every keystroke. Explain zero and shortfall with words and numbers, not color alone.
- Keep the journey usable on mobile and desktop.

## Explicit exclusions

No exact dates, recurring costs, multiple planning periods, multi-currency support, accounts, bank connections, transaction imports, payment recording, forecasts, spending categories, recommendations, notifications, or saving or transmitting entered figures. The check is not a complete budgeting system.

## Acceptance criteria

1. A user can enter their own available money and costs, edit or remove those costs, and see the before-expense calculation in NGN.
2. A user with no costs can obtain a result only after explicitly confirming that state. An untouched empty list cannot produce a result, and removing the last cost requires confirmation again.
3. A user can try, change, and clear one possible expense without changing the costs list; valid changes update the correct calculation steps.
4. A shortfall caused by commitments alone is shown before a possible expense is entered. Adding an expense increases that shortfall by the expense amount.
5. Exactly zero remaining is labeled and explained differently from a negative shortfall. The displayed arithmetic supports each result.
6. Whole-naira NGN amounts are formatted consistently. Decimal or kobo input is rejected with clear guidance and is never rounded.
7. Missing, incomplete, or invalid input makes the ready result unavailable immediately; no prior result remains presented as current. A newly added draft can show only a clearly labelled live estimate from current valid amounts, with an explicit note about whether its amount is included. Invalid amounts and unsafe calculations suppress that preview.
8. The limitations are visible with the result. The interface never claims an expense is safe or affordable.
9. A user can complete and reset the journey with a keyboard and understand fields, errors, and results with a screen reader on mobile and desktop.
10. Refresh clears the entered figures. The feature neither saves nor transmits them.

## Resolved decisions

The initial audience, user-defined period before next income, NGN as the sole currency, whole-naira precision, explicit no-cost confirmation, and session-only behavior are approved. There are no outstanding specification decisions before implementation planning.
