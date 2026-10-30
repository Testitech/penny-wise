import Illustration from "@/components/Illustration";
import { currentBalanceCents, formatMoney, getMoneyPlan, optionalExpense } from "@/data/money-plan";

export default function HowItWorks() {
  const basePlan = getMoneyPlan(false);
  const repairPlan = getMoneyPlan(true);
  const steps = [
    {
      title: "Read the starting balance",
      description: `The example starts with ${formatMoney(currentBalanceCents)}. Past spending is already reflected in that balance.`,
    },
    {
      title: "Account for upcoming bills",
      description: `Set aside ${formatMoney(basePlan.commitmentsCents)} for the listed commitments. That leaves ${formatMoney(basePlan.remainingCents)}, before any other future expenses.`,
    },
    {
      title: "Try one extra expense",
      description: `Include the ${formatMoney(optionalExpense.amountCents)} bike repair to see the remaining amount change from ${formatMoney(basePlan.remainingCents)} to ${formatMoney(repairPlan.remainingCents)}. Switch it off to restore the base plan.`,
    },
  ];

  return (
    <section id="how-it-works" className="how-section" aria-labelledby="how-title">
      <div className="how-intro">
        <h2 id="how-title" data-reveal>How the plan works.</h2>
        <p data-reveal>Read the balance, account for bills, then try the repair.</p>
        <div className="process-art" data-reveal><Illustration name="moneyProcess" /></div>
      </div>
      <div className="feature-rows">
        {steps.map((step, index) => (
          <details key={step.title} open={index === 0} data-reveal>
            <summary>
              <span>{step.title}</span>
              <svg className="row-toggle" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 9h12M9 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </summary>
            <p>{step.description}</p>
            {index === 2 && <a className="inline-demo-link" href="#expense-demo">Try the repair</a>}
          </details>
        ))}
      </div>
    </section>
  );
}
