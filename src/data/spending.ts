// Fictional spending for 17–23 October 2026; already reflected in the current balance.
export const spending = [
  { category: "Groceries", amountCents: 6800 },
  { category: "Eating out", amountCents: 7600 },
  { category: "Transport", amountCents: 2400 },
  { category: "Coffee", amountCents: 1800 },
] as const;

export const spendingTotalCents = spending.reduce((total, row) => total + row.amountCents, 0);
export const weeklyCheckIns = [true, true, false, true] as const;
