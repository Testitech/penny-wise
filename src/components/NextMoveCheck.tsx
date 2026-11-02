"use client";

import { useEffect, useRef, useState } from "react";
import NextMoveResult from "./NextMoveResult";
import {
  describeRemainder,
  evaluateCheck,
  evaluateDraftPreview,
  type CheckErrors,
  type CheckInput,
  type CheckResult,
  type CostInput,
  type DraftPreview,
} from "@/lib/next-move-check";
import styles from "./NextMoveCheck.module.css";

const emptyCheck: CheckInput = {
  available: "",
  costs: [],
  noCostsConfirmed: false,
  possibleExpenseName: "",
  possibleExpenseAmount: "",
};

function resultAnnouncement(result: CheckResult): string {
  const before = `Before the possible expense: ${describeRemainder(result.beforeExpense)}.`;
  const after = result.afterExpense === null
    ? ""
    : ` After the possible expense: ${describeRemainder(result.afterExpense)}.`;
  return `Estimate ready. ${before}${after}`;
}

function estimateAnnouncement(result: CheckResult, preview: DraftPreview | null): string {
  if (!preview) return resultAnnouncement(result);
  const included = preview.draftAmountIncluded
    ? "The new cost amount is included; add its name to complete the cost."
    : "The unfinished cost is not included yet.";
  const after = result.afterExpense === null
    ? ""
    : ` After the possible expense: ${describeRemainder(result.afterExpense)}.`;
  return `Live estimate, cost in progress. Before the possible expense: ${describeRemainder(result.beforeExpense)}.${after} ${included}`;
}

function fieldError(errors: CheckErrors, field: string): string | undefined {
  if (field === "available") return errors.available;
  if (field === "expense-name" || field === "expense-amount") return errors.possibleExpense;
  const [costId, part] = field.split(":");
  if (part === "name") return errors.costs[costId]?.name;
  if (part === "amount") {
    return errors.costs[costId]?.amount ??
      (errors.calculationSource === "cost-total" ? errors.calculation : undefined);
  }
  return undefined;
}

export default function NextMoveCheck() {
  const [check, setCheck] = useState<CheckInput>(emptyCheck);
  const [draftCostId, setDraftCostId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(() => new Set());
  const nextCostId = useRef(0);
  const pendingFocus = useRef<string | null>(null);
  const pointerInteracting = useRef(false);
  const pendingPointerBlur = useRef<string | null>(null);
  const announcementTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAnnouncement = useRef("");
  const availableRef = useRef<HTMLInputElement>(null);
  const expenseAmountRef = useRef<HTMLInputElement>(null);
  const estimateRef = useRef<HTMLDivElement>(null);
  const addCostRef = useRef<HTMLButtonElement>(null);
  const costNameRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const evaluation = evaluateCheck(check);
  const preview = evaluation.result ? null : evaluateDraftPreview(check, draftCostId);
  const displayedResult = evaluation.result ?? preview?.result ?? null;
  const started = hasInteracted || check.available.trim() !== "" || check.costs.length > 0 || check.noCostsConfirmed ||
    check.possibleExpenseName.trim() !== "" || check.possibleExpenseAmount.trim() !== "";

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    if (target === "add") addCostRef.current?.focus();
    else if (target === "expense") expenseAmountRef.current?.focus();
    else if (target.endsWith(":amount")) document.getElementById(`${target.split(":")[0]}-amount`)?.focus();
    else if (target.endsWith(":name")) costNameRefs.current[target.split(":")[0]]?.focus();
    else costNameRefs.current[target]?.focus();
  }, [check.costs, check.possibleExpenseName, check.possibleExpenseAmount, touched]);

  useEffect(() => () => {
    if (announcementTimer.current) clearTimeout(announcementTimer.current);
  }, []);

  function cancelAnnouncement() {
    if (announcementTimer.current) clearTimeout(announcementTimer.current);
    announcementTimer.current = null;
  }

  function announceNow(message: string) {
    cancelAnnouncement();
    if (lastAnnouncement.current === message) return;
    lastAnnouncement.current = message;
    setAnnouncement(message);
  }

  function scheduleInputAnnouncement(next: CheckInput, field: string) {
    cancelAnnouncement();
    lastAnnouncement.current = "";
    setAnnouncement("");
    const nextEvaluation = evaluateCheck(next);
    const nextPreview = nextEvaluation.result ? null : evaluateDraftPreview(next, draftCostId);
    const nextResult = nextEvaluation.result ?? nextPreview?.result;
    let message = "";
    if (nextResult) {
      const nextResultMessage = estimateAnnouncement(nextResult, nextPreview);
      if (!displayedResult || estimateAnnouncement(displayedResult, preview) !== nextResultMessage) {
        message = nextResultMessage;
      }
    } else if (displayedResult) {
      const reason = fieldError(nextEvaluation.errors, field);
      message = `Estimate unavailable. ${reason ?? "Finish or fix this input to update it."}`;
    }
    if (message) {
      announcementTimer.current = setTimeout(() => announceNow(message), 800);
    }
  }

  function markTouched(field: string) {
    setTouched((current) => new Set(current).add(field));
  }

  function update(patch: Partial<CheckInput>) {
    setHasInteracted(true);
    const next = { ...check, ...patch };
    setCheck(next);
    const field = "available" in patch ? "available" :
      "possibleExpenseName" in patch ? "expense-name" : "expense-amount";
    markTouched(field);
    scheduleInputAnnouncement(next, field);
  }

  function announceOnBlur(field: string) {
    if (pointerInteracting.current) {
      pendingPointerBlur.current = field;
      return;
    }
    setHasInteracted(true);
    markTouched(field);
    const error = fieldError(evaluation.errors, field);
    if (error) announceNow(error);
    else if (displayedResult) announceNow(estimateAnnouncement(displayedResult, preview));
  }

  function addCost() {
    setHasInteracted(true);
    const incomplete = check.costs.find((cost) => evaluation.errors.costs[cost.id]);
    if (incomplete) {
      const nameNeedsAttention = Boolean(evaluation.errors.costs[incomplete.id].name);
      const field = `${incomplete.id}:${nameNeedsAttention ? "name" : "amount"}`;
      pendingFocus.current = field;
      markTouched(field);
      announceNow(`Finish this cost before adding another. ${fieldError(evaluation.errors, field)}`);
      return;
    }
    const id = `cost-${++nextCostId.current}`;
    const cost: CostInput = { id, name: "", amount: "" };
    pendingFocus.current = id;
    const next = { ...check, costs: [...check.costs, cost], noCostsConfirmed: false };
    setDraftCostId(id);
    setCheck(next);
    const nextPreview = evaluateDraftPreview(next, id);
    announceNow(nextPreview
      ? `Cost added. ${estimateAnnouncement(nextPreview.result, nextPreview)}`
      : "Cost added. Enter its name and amount.");
  }

  function updateCost(id: string, patch: Partial<CostInput>) {
    setHasInteracted(true);
    const next = { ...check, costs: check.costs.map((cost) => cost.id === id ? { ...cost, ...patch } : cost) };
    setCheck(next);
    const updatedCost = next.costs.find((cost) => cost.id === id)!;
    if (id === draftCostId && updatedCost.name.trim() && !evaluateCheck(next).errors.costs[id]) {
      setDraftCostId(null);
    }
    const field = `${id}:${"name" in patch ? "name" : "amount"}`;
    scheduleInputAnnouncement(next, field);
  }

  function removeCost(id: string) {
    setHasInteracted(true);
    const index = check.costs.findIndex((cost) => cost.id === id);
    if (index < 0) return;
    const remaining = check.costs.filter((cost) => cost.id !== id);
    setTouched((current) => {
      const next = new Set(current);
      next.delete(`${id}:name`);
      next.delete(`${id}:amount`);
      return next;
    });
    pendingFocus.current = remaining[Math.min(index, remaining.length - 1)]?.id ?? "add";
    const next = { ...check, costs: remaining, noCostsConfirmed: false };
    setCheck(next);
    if (id === draftCostId) setDraftCostId(null);
    const nextResult = evaluateCheck(next).result;
    announceNow(remaining.length === 0
      ? "Last cost removed. Add a cost or confirm you have no costs to add. Estimate unavailable."
      : nextResult ? `Cost removed. ${resultAnnouncement(nextResult)}` : "Cost removed. Estimate unavailable until the remaining inputs are complete.");
  }

  function reset() {
    cancelAnnouncement();
    setCheck(emptyCheck);
    setDraftCostId(null);
    setHasInteracted(false);
    setTouched(new Set());
    announceNow("Check reset. Enter money available now.");
    availableRef.current?.focus();
  }

  const showAvailableError = (touched.has("available") || check.available.trim() !== "") && evaluation.errors.available;
  const showConfirmationError = started && evaluation.errors.costConfirmation;
  const showExpenseError = (touched.has("expense-amount") || check.possibleExpenseName.trim() !== "" ||
    check.possibleExpenseAmount.trim() !== "") && evaluation.errors.possibleExpense;
  const showAggregateError = evaluation.errors.calculationSource === "cost-total";

  return (
    <div
      className={styles.workspace}
      onPointerDownCapture={() => { pointerInteracting.current = true; }}
      onPointerUpCapture={() => { pointerInteracting.current = false; }}
      onPointerCancelCapture={() => { pointerInteracting.current = false; pendingPointerBlur.current = null; }}
      onPointerLeave={() => { pointerInteracting.current = false; pendingPointerBlur.current = null; }}
      onClick={(event) => {
        const field = pendingPointerBlur.current;
        pendingPointerBlur.current = null;
        if (!field || (event.target as HTMLElement).closest("button, a, label")) return;
        markTouched(field);
        const error = fieldError(evaluation.errors, field);
        if (error) announceNow(error);
        else if (displayedResult) announceNow(estimateAnnouncement(displayedResult, preview));
      }}
    >
      <div className={styles.intro}>
        <h1>Next Move Check</h1>
        <p>What might be left after the costs you expect before your next income?</p>
        <p className={styles.context}>Enter your own estimates in Nigerian naira. This check stays in this page and clears when you refresh.</p>
      </div>
      <div className={styles.columns}>
          <section className={`${styles.block} ${styles.availableBlock}`} aria-labelledby="available-title">
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
              onBlur={() => announceOnBlur("available")}
              aria-invalid={showAvailableError ? true : undefined}
              aria-describedby={showAvailableError ? "available-hint available-error" : "available-hint"}
              placeholder="e.g. 100000"
            />
            {showAvailableError && <p className={styles.error} id="available-error">{evaluation.errors.available}</p>}
          </section>

          <section className={`${styles.block} ${styles.costsBlock}`} aria-labelledby="costs-title">
            <h2 id="costs-title">2. Costs before next income</h2>
            <p className={styles.hint}>Include unpaid bills and everyday costs you expect to cover. You decide which costs belong in this check.</p>
            {check.costs.length > 0 && (
              <div className={styles.costList}>
                {check.costs.map((cost, index) => {
                  const errors = evaluation.errors.costs[cost.id];
                  const showNameError = errors?.name && touched.has(`${cost.id}:name`);
                  const showAmountError = errors?.amount &&
                    (touched.has(`${cost.id}:amount`) || cost.amount.trim() !== "");
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
                            onBlur={() => announceOnBlur(`${cost.id}:name`)}
                            aria-invalid={showNameError ? true : undefined}
                            aria-describedby={showNameError ? `${cost.id}-name-error` : undefined}
                            placeholder="e.g. Transport"
                          />
                          {showNameError && <p className={styles.error} id={`${cost.id}-name-error`}>{errors.name}</p>}
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
                            onBlur={() => announceOnBlur(`${cost.id}:amount`)}
                            aria-invalid={showAmountError || showAggregateError ? true : undefined}
                            aria-describedby={[
                              showAmountError ? `${cost.id}-amount-error` : "",
                              showAggregateError ? "cost-total-error" : "",
                            ].filter(Boolean).join(" ") || undefined}
                            placeholder="e.g. 12000"
                          />
                          {showAmountError && <p className={styles.error} id={`${cost.id}-amount-error`}>{errors.amount}</p>}
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
            {showAggregateError && <p className={styles.error} id="cost-total-error">{evaluation.errors.calculation}</p>}
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
                      const result = evaluateCheck(next).result;
                      announceNow(result ? resultAnnouncement(result) : event.target.checked
                        ? "No costs confirmed. Enter money available now to see an estimate."
                        : "No-cost confirmation removed. Estimate unavailable.");
                    }}
                  />
                  I have no costs to add before my next income
                </label>
                {showConfirmationError && <p className={styles.error} id="cost-confirmation-error">{evaluation.errors.costConfirmation}</p>}
              </div>
            )}
          </section>

          <div
            ref={estimateRef}
            id="estimate"
            tabIndex={-1}
            className={styles.output}
            aria-labelledby="result-title"
          >
            {displayedResult ? <NextMoveResult result={displayedResult} draftAmountIncluded={preview?.draftAmountIncluded} /> : (
              <section className={styles.emptyResult} aria-labelledby="result-title">
                <h2 id="result-title">Your estimate</h2>
                <p className={styles.resultState}>Estimate unavailable</p>
                <p>{started ? "Finish or fix the inputs to update this estimate." : "Enter money available now and your costs to see an estimate."}</p>
                {evaluation.errors.calculationSource === "result" && <p className={styles.error}>{evaluation.errors.calculation}</p>}
                <p className={styles.limit}>This check uses only the figures you enter. It is not an affordability recommendation.</p>
              </section>
            )}
          </div>

          <section className={`${styles.block} ${styles.expenseBlock}`} aria-labelledby="expense-title">
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
                  onBlur={() => announceOnBlur("expense-name")}
                  aria-describedby={showExpenseError && check.possibleExpenseName.trim() && !check.possibleExpenseAmount.trim() ? "expense-error" : undefined}
                  placeholder="e.g. New shoes"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="expense-amount">Amount in ₦</label>
                <input
                  ref={expenseAmountRef}
                  id="expense-amount"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={check.possibleExpenseAmount}
                  onChange={(event) => update({ possibleExpenseAmount: event.target.value })}
                  onBlur={() => announceOnBlur("expense-amount")}
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
                pendingFocus.current = "expense";
                setCheck(next);
                setTouched((current) => {
                  const updated = new Set(current);
                  updated.delete("expense-amount");
                  return updated;
                });
                const result = evaluateCheck(next).result;
                const nextPreview = result ? null : evaluateDraftPreview(next, draftCostId);
                const displayed = result ?? nextPreview?.result;
                announceNow(displayed
                  ? `Possible expense cleared. ${estimateAnnouncement(displayed, nextPreview)}`
                  : "Possible expense cleared. Estimate unavailable until the other inputs are complete.");
              }}>Clear possible expense</button>
            )}
            {displayedResult && displayedResult.afterExpense !== null && (
              <a
                className={styles.estimateLink}
                href="#estimate"
                onClick={() => requestAnimationFrame(() => estimateRef.current?.focus({ preventScroll: true }))}
              >View updated estimate</a>
            )}
          </section>
          <button className={styles.resetButton} type="button" onClick={reset}>Reset check</button>
      </div>
      <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}
