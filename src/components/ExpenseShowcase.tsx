"use client";

import { useMoneyPlan } from "@/components/MoneyPlanProvider";
import { formatMoney, getMoneyPlan, optionalExpense } from "@/data/money-plan";
import Illustration from "@/components/Illustration";

export default function ExpenseShowcase() {
  const { includeRepair, setIncludeRepair } = useMoneyPlan();
  const plan = getMoneyPlan(includeRepair);

  return (
    <section id="preview" className="decision-section" aria-labelledby="showcase-title">
      <div className="decision-copy">
        <h2 id="showcase-title" data-reveal>Make room for<br />real life.</h2>
        <p data-reveal>A bike repair. A bill. An ordinary decision. See what changes before you make it.</p>
        <a className="preview-action" href="#expense-demo" data-reveal>Try the money plan</a>
        <div className="decision-art" data-reveal><Illustration name="nextMove" /></div>
      </div>
      <div className="decision-metrics" data-ui>
        <div className="decision-tile expense-tile" data-reveal>
          <span>Unexpected expense</span>
          <strong>{formatMoney(optionalExpense.amountCents)}</strong>
          <p>Bike repair · 30 Oct</p>
          <label className="decision-switch" htmlFor="showcase-repair">
            <input id="showcase-repair" type="checkbox" checked={includeRepair} onChange={(event) => setIncludeRepair(event.target.checked)} />
            Include in my example
          </label>
        </div>
        <div className="decision-tile commitments-tile" data-reveal>
          <span>Upcoming commitments</span>
          <strong>{formatMoney(plan.commitmentsCents)}</strong>
          <p>{includeRepair ? "Bike repair included" : "Your base plan"}</p>
        </div>
        <div className="decision-tile remaining-tile" data-reveal>
          <span>Remaining after commitments</span>
          <strong>{formatMoney(plan.remainingCents)}</strong>
          <p>One clearer next move.</p>
        </div>
      </div>
      <p className="decision-note">One shared, fictional example. The switch updates the plan above. Nothing is paid, saved, or sent.</p>
    </section>
  );
}
