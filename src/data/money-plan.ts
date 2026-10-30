export type Expense = {
  id: string;
  name: string;
  date: string;
  amountCents: number;
};

// Fictional USD snapshot. Past spending is already reflected in this balance.
export const currentBalanceCents = 124000;
export const commitments: readonly Expense[] = [
  { id: "rent", name: "Rent contribution", date: "2026-10-24", amountCents: 48000 },
  { id: "internet", name: "Internet", date: "2026-10-26", amountCents: 6000 },
  { id: "transport", name: "Transport pass", date: "2026-10-29", amountCents: 10000 },
];
export const optionalExpense: Expense = {
  id: "repair", name: "Bike repair", date: "2026-10-30", amountCents: 8000,
};

export function getMoneyPlan(includeRepair: boolean) {
  const expenses = includeRepair ? [...commitments, optionalExpense] : commitments;
  const commitmentsCents = expenses.reduce((total, expense) => total + expense.amountCents, 0);
  return { expenses, commitmentsCents, remainingCents: currentBalanceCents - commitmentsCents };
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(cents / 100);
}
