export type CostInput = { id: string; name: string; amount: string };

export type CheckInput = {
  available: string;
  costs: CostInput[];
  noCostsConfirmed: boolean;
  possibleExpenseName: string;
  possibleExpenseAmount: string;
};

export type CheckErrors = {
  available?: string;
  costs: Record<string, { name?: string; amount?: string }>;
  costConfirmation?: string;
  possibleExpense?: string;
  calculation?: string;
};

export type CheckResult = {
  available: number;
  commitments: number;
  beforeExpense: number;
  possibleExpense: number | null;
  afterExpense: number | null;
};

export type CheckEvaluation = { result: CheckResult | null; errors: CheckErrors };

const ngnFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatNaira(amount: number): string {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new RangeError("NGN amount must be a nonnegative safe integer.");
  }
  return ngnFormatter.format(amount).replace(/\u00a0/g, " ");
}

export function formatSignedNaira(amount: number): string {
  if (!Number.isSafeInteger(amount)) {
    throw new RangeError("NGN amount must be a safe integer.");
  }
  return amount < 0 ? `−${formatNaira(-amount)}` : formatNaira(amount);
}

export function describeRemainder(amount: number): string {
  if (!Number.isSafeInteger(amount)) {
    throw new RangeError("Remainder must be a safe integer.");
  }
  if (amount < 0) return `Short by ${formatNaira(-amount)}`;
  if (amount === 0) return `${formatNaira(0)} remaining`;
  return `${formatNaira(amount)} remaining`;
}

export function parseNaira(raw: string, label: string, allowZero: boolean): { value: number | null; error?: string } {
  const text = raw.trim();
  if (text === "") return { value: null, error: `Enter ${label}.` };
  if (!/^\d+$/.test(text)) {
    return { value: null, error: `Enter ${label} as a whole-naira amount, without decimals or symbols.` };
  }
  const value = Number(text);
  if (!Number.isSafeInteger(value)) {
    return { value: null, error: `${label} is too large. Enter a smaller whole-naira amount.` };
  }
  if (!allowZero && value === 0) {
    return { value: null, error: `${label} must be more than ${formatNaira(0)}.` };
  }
  return { value };
}

export function evaluateCheck(input: CheckInput): CheckEvaluation {
  const errors: CheckErrors = { costs: {} };
  const available = parseNaira(input.available, "money available now", true);
  if (available.error) errors.available = available.error;

  let commitments = 0;
  for (const cost of input.costs) {
    const costErrors: { name?: string; amount?: string } = {};
    if (!cost.name.trim()) costErrors.name = "Enter a name for this cost.";
    const parsed = parseNaira(cost.amount, "the cost amount", false);
    if (parsed.error) costErrors.amount = parsed.error;
    if (costErrors.name || costErrors.amount) errors.costs[cost.id] = costErrors;
    if (parsed.value !== null) {
      const nextTotal = commitments + parsed.value;
      if (!Number.isSafeInteger(nextTotal)) {
        errors.calculation = "The total costs are too large to calculate. Reduce an amount.";
      } else {
        commitments = nextTotal;
      }
    }
  }
  if (input.costs.length === 0 && !input.noCostsConfirmed) {
    errors.costConfirmation = "Add a cost or confirm you have no costs to add.";
  }

  const expenseAmountEntered = input.possibleExpenseAmount.trim() !== "";
  const expenseNameEntered = input.possibleExpenseName.trim() !== "";
  let possibleExpense: number | null = null;
  if (expenseAmountEntered) {
    const parsed = parseNaira(input.possibleExpenseAmount, "the possible expense", false);
    if (parsed.error) errors.possibleExpense = parsed.error;
    possibleExpense = parsed.value;
  } else if (expenseNameEntered) {
    errors.possibleExpense = "Enter an amount for the possible expense or clear its name.";
  }

  if (errors.available || Object.keys(errors.costs).length || errors.costConfirmation || errors.possibleExpense || errors.calculation) {
    return { result: null, errors };
  }

  const beforeExpense = available.value! - commitments;
  if (!Number.isSafeInteger(beforeExpense)) {
    errors.calculation = "The result is too large to calculate. Reduce an amount.";
    return { result: null, errors };
  }
  const afterExpense = possibleExpense === null ? null : beforeExpense - possibleExpense;
  if (afterExpense !== null && !Number.isSafeInteger(afterExpense)) {
    errors.calculation = "The result is too large to calculate. Reduce an amount.";
    return { result: null, errors };
  }

  return {
    result: {
      available: available.value!,
      commitments,
      beforeExpense,
      possibleExpense,
      afterExpense,
    },
    errors,
  };
}
