"use client";

import { useMoneyPlan } from "@/components/MoneyPlanProvider";
import { currentBalanceCents, formatMoney, getMoneyPlan, optionalExpense } from "@/data/money-plan";

export default function DashboardPreview() {
  const { includeRepair, setIncludeRepair } = useMoneyPlan();
  const plan = getMoneyPlan(includeRepair);

  return (
    <section id="money-plan" aria-labelledby="plan-title" data-ui className="money-preview">
      <div className="plan-heading">
        <h2 id="plan-title">Money plan</h2>
        <span className="plan-currency">Pennywise · USD</span>
      </div>
      <p className="snapshot">Fictional snapshot · 23 October 2026</p>
      <div className="dashboard-body"><div className="dashboard-overview"><div className="plan-panel">
        <dl className="plan-equation">
          <div>
            <dt>Current balance</dt>
            <dd>{formatMoney(currentBalanceCents)}</dd>
          </div>
          <div aria-hidden="true" className="equation-sign"><dt className="sr-only">Minus</dt><dd>−</dd></div>
          <div>
            <dt>Upcoming commitments</dt>
            <dd>{formatMoney(plan.commitmentsCents)}</dd>
          </div>
          <div aria-hidden="true" className="equation-sign"><dt className="sr-only">Equals</dt><dd>=</dd></div>
          <div className="remaining">
            <dt>Remaining after these commitments</dt>
            <dd>{formatMoney(plan.remainingCents)}</dd>
          </div>
        </dl>
        <div className="plan-bar" aria-hidden="true">
          <span className="plan-bar-committed" style={{ width: `${(plan.commitmentsCents / currentBalanceCents) * 100}%` }} />
        </div>
        <div className="plan-bar-labels" aria-hidden="true"><span>Committed</span><span>Remaining</span></div>
      </div>

      <div id="expense-demo" className="preset-panel">
        <label htmlFor="repair-preset" className="preset-label">
          <span className="preset-copy"><span className="preset-title">Room for one more expense?</span><span>Include an {formatMoney(optionalExpense.amountCents)} bike repair</span></span>
          <input
            id="repair-preset"
            type="checkbox"
            checked={includeRepair}
            onChange={(event) => setIncludeRepair(event.target.checked)}
            aria-describedby="preset-help"
          />
        </label>
        <p id="preset-help">Try the repair to see what remains. This only changes the example.</p>
        <div className="preset-result">
          <span>Remaining after commitments</span>
          <strong>{formatMoney(plan.remainingCents)}</strong>
        </div>
      </div>

      </div><div className="dashboard-upcoming">
      <div className="expenses-heading">
        <h3>Coming up</h3>
        <span>24–31 October</span>
      </div>
      <ul className="expense-list">
        {plan.expenses.map((expense) => (
          <li key={expense.id}>
            <time dateTime={expense.date}><span>{Number(expense.date.slice(-2))}</span><span>Oct</span></time>
            <span className="expense-name">{expense.name}</span>
            <span className="expense-amount">{formatMoney(expense.amountCents)}</span>
          </li>
        ))}
      </ul>
      </div></div>

      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {formatMoney(currentBalanceCents)} balance minus {formatMoney(plan.commitmentsCents)} upcoming commitments equals {formatMoney(plan.remainingCents)} remaining after those commitments.
      </p>
      <p className="preview-disclaimer">Sample data only. Remaining money does not account for other future expenses. Nothing is paid, saved, or sent.</p>
    </section>
  );
}
