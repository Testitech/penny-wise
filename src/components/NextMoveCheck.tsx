"use client";

import { useEffect, useRef, useState } from "react";
import NextMoveResult from "./NextMoveResult";
import {
  describeRemainder,
  evaluateCheck,
  type CheckInput,
  type CostInput,
} from "@/lib/next-move-check";
import styles from "./NextMoveCheck.module.css";

const emptyCheck: CheckInput = {
  available: "",
  costs: [],
  noCostsConfirmed: false,
  possibleExpenseName: "",
  possibleExpenseAmount: "",
};

function resultAnnouncement(input: CheckInput): string {
  const { result, errors } = evaluateCheck(input);
  if (result) {
    const last = result.afterExpense ?? result.beforeExpense;
    return `Estimate updated. ${describeRemainder(last)}.`;
  }
  const firstCostError = Object.values(errors.costs)[0];
  const reason = errors.available ?? firstCostError?.name ?? firstCostError?.amount ??
    errors.costConfirmation ?? errors.possibleExpense ?? errors.calculation;
  return reason ? `Result unavailable. ${reason}` : "Result unavailable.";
}

export default function NextMoveCheck() {
  const [check, setCheck] = useState<CheckInput>(emptyCheck);
  const [announcement, setAnnouncement] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const nextCostId = useRef(0);
  const pendingFocus = useRef<string | null>(null);
  const availableRef = useRef<HTMLInputElement>(null);
  const addCostRef = useRef<HTMLButtonElement>(null);
  const costNameRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const evaluation = evaluateCheck(check);
  const started = hasInteracted || check.available.trim() !== "" || check.costs.length > 0 || check.noCostsConfirmed ||
    check.possibleExpenseName.trim() !== "" || check.possibleExpenseAmount.trim() !== "";

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    if (target === "add") addCostRef.current?.focus();
    else costNameRefs.current[target]?.focus();
  }, [check.costs]);

  function update(patch: Partial<CheckInput>) {
    setHasInteracted(true);
    setCheck((current) => ({ ...current, ...patch }));
    setAnnouncement("");
  }

  function announceOnBlur() {
    setHasInteracted(true);
    setAnnouncement(resultAnnouncement(check));
  }

  function addCost() {
    setHasInteracted(true);
    const id = `cost-${++nextCostId.current}`;
    const cost: CostInput = { id, name: "", amount: "" };
    pendingFocus.current = id;
    setCheck((current) => ({ ...current, costs: [...current.costs, cost], noCostsConfirmed: false }));
    setAnnouncement("Cost added. Enter its name and amount.");
  }

  function updateCost(id: string, patch: Partial<CostInput>) {
    setHasInteracted(true);
    setCheck((current) => ({
      ...current,
      costs: current.costs.map((cost) => cost.id === id ? { ...cost, ...patch } : cost),
    }));
    setAnnouncement("");
  }

  function removeCost(id: string) {
    setHasInteracted(true);
    const index = check.costs.findIndex((cost) => cost.id === id);
    if (index < 0) return;
    const remaining = check.costs.filter((cost) => cost.id !== id);
    pendingFocus.current = remaining[Math.min(index, remaining.length - 1)]?.id ?? "add";
    const next = { ...check, costs: remaining, noCostsConfirmed: false };
    setCheck(next);
    setAnnouncement(remaining.length === 0
      ? "Last cost removed. Add a cost or confirm you have no costs to add. Result unavailable."
      : resultAnnouncement(next));
  }

  function reset() {
    setCheck(emptyCheck);
    setHasInteracted(false);
    setAnnouncement("Check reset. Enter money available now.");
    availableRef.current?.focus();
  }

  const showAvailableError = started && evaluation.errors.available;
  const showConfirmationError = started && evaluation.errors.costConfirmation;
  const showExpenseError = started && evaluation.errors.possibleExpense;

  return (
    <div className={styles.workspace}>
      <div className={styles.intro}>
        <h1>Next Move Check</h1>
        <p>What might be left after the costs you expect before your next income?</p>
        <p className={styles.context}>Enter your own estimates in Nigerian naira. This check stays in this page and clears when you refresh.</p>
      </div>
      <div className={styles.columns}>
        <div className={styles.inputs}>
          <section className={styles.block} aria-labelledby="available-title">
            <h2 id="available-title">1. Money available now</h2>
            <p className={styles.hint} id="available-hint">Use the amount you have now. Do not add costs already reflected in it.</p>
            <label htmlFor="available">Amount in ₦</label>
            <input
              ref={availableRef}
              id="available"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={check.available}
              onChange={(event) => update({ available: event.target.value })}
              onBlur={announceOnBlur}
              aria-invalid={showAvailableError ? true : undefined}
              aria-describedby={showAvailableError ? "available-hint available-error" : "available-hint"}
              placeholder="e.g. 100000"
            />
            {showAvailableError && <p className={styles.error} id="available-error">{evaluation.errors.available}</p>}
          </section>

          <section className={styles.block} aria-labelledby="costs-title">
            <h2 id="costs-title">2. Costs before next income</h2>
            <p className={styles.hint}>Include unpaid bills and everyday costs you expect to cover. You decide which costs belong in this check.</p>
            {check.costs.length > 0 && (
              <div className={styles.costList}>
                {check.costs.map((cost, index) => {
                  const errors = evaluation.errors.costs[cost.id];
                  return (
                    <div className={styles.costRow} key={cost.id}>
                      <div className={styles.costFields}>
                        <div className={styles.field}>
                          <label htmlFor={`${cost.id}-name`}>Cost {index + 1} name</label>
                          <input
                            ref={(node) => { costNameRefs.current[cost.id] = node; }}
                            id={`${cost.id}-name`}
                            type="text"
                            autoComplete="off"
                            value={cost.name}
                            onChange={(event) => updateCost(cost.id, { name: event.target.value })}
                            onBlur={announceOnBlur}
                            aria-invalid={errors?.name ? true : undefined}
                            aria-describedby={errors?.name ? `${cost.id}-name-error` : undefined}
                            placeholder="e.g. Transport"
                          />
                          {errors?.name && <p className={styles.error} id={`${cost.id}-name-error`}>{errors.name}</p>}
                        </div>
                        <div className={styles.field}>
                          <label htmlFor={`${cost.id}-amount`}>Cost {index + 1} amount in ₦</label>
                          <input
                            id={`${cost.id}-amount`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            value={cost.amount}
                            onChange={(event) => updateCost(cost.id, { amount: event.target.value })}
                            onBlur={announceOnBlur}
                            aria-invalid={errors?.amount ? true : undefined}
                            aria-describedby={errors?.amount ? `${cost.id}-amount-error` : undefined}
                            placeholder="e.g. 12000"
                          />
                          {errors?.amount && <p className={styles.error} id={`${cost.id}-amount-error`}>{errors.amount}</p>}
                        </div>
                      </div>
                      <button className={styles.dangerButton} type="button" onClick={() => removeCost(cost.id)} aria-label={`Remove cost ${index + 1}${cost.name.trim() ? `, ${cost.name.trim()}` : ""}`}>
                        Remove cost
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <button ref={addCostRef} className={styles.secondaryButton} type="button" onClick={addCost}>Add a cost</button>
            {check.costs.length === 0 && (
              <div className={styles.confirmation}>
                <label className={styles.checkLabel} htmlFor="no-costs">
                  <input
                    id="no-costs"
                    type="checkbox"
                    checked={check.noCostsConfirmed}
                    aria-describedby={showConfirmationError ? "cost-confirmation-error" : undefined}
                    onChange={(event) => {
                      setHasInteracted(true);
                      const next = { ...check, noCostsConfirmed: event.target.checked };
                      setCheck(next);
                      setAnnouncement(resultAnnouncement(next));
                    }}
                  />
                  I have no costs to add before my next income
                </label>
                {showConfirmationError && <p className={styles.error} id="cost-confirmation-error">{evaluation.errors.costConfirmation}</p>}
              </div>
            )}
          </section>

          <section className={styles.block} aria-labelledby="expense-title">
            <h2 id="expense-title">3. Possible expense <span className={styles.optional}>(optional)</span></h2>
            <p className={styles.hint}>Try one expense you are considering. It does not change your costs or record a payment.</p>
            <div className={styles.expenseFields}>
              <div className={styles.field}>
                <label htmlFor="expense-name">Name (optional)</label>
                <input
                  id="expense-name"
                  type="text"
                  autoComplete="off"
                  value={check.possibleExpenseName}
                  onChange={(event) => update({ possibleExpenseName: event.target.value })}
                  onBlur={announceOnBlur}
                  placeholder="e.g. New shoes"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="expense-amount">Amount in ₦</label>
                <input
                  id="expense-amount"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={check.possibleExpenseAmount}
                  onChange={(event) => update({ possibleExpenseAmount: event.target.value })}
                  onBlur={announceOnBlur}
                  aria-invalid={showExpenseError ? true : undefined}
                  aria-describedby={showExpenseError ? "expense-error" : undefined}
                  placeholder="e.g. 15000"
                />
              </div>
            </div>
            {showExpenseError && <p className={styles.error} id="expense-error">{evaluation.errors.possibleExpense}</p>}
            {(check.possibleExpenseName || check.possibleExpenseAmount) && (
              <button className={styles.clearButton} type="button" onClick={() => {
                setHasInteracted(true);
                const next = { ...check, possibleExpenseName: "", possibleExpenseAmount: "" };
                setCheck(next);
                setAnnouncement(resultAnnouncement(next));
              }}>Clear possible expense</button>
            )}
          </section>
          <button className={styles.resetButton} type="button" onClick={reset}>Reset check</button>
        </div>
        <div className={styles.output}>
          {evaluation.result ? <NextMoveResult result={evaluation.result} /> : (
            <section className={styles.emptyResult} aria-labelledby="result-title">
              <h2 id="result-title">Your estimate</h2>
              <p>{started ? "Result unavailable until the missing or invalid information is fixed." : "Enter money available now and your costs to see an estimate."}</p>
              {evaluation.errors.calculation && <p className={styles.error}>{evaluation.errors.calculation}</p>}
              <p className={styles.limit}>This check uses only the figures you enter. It is not an affordability recommendation.</p>
            </section>
          )}
        </div>
      </div>
      <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}
