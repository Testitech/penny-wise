import Illustration from "@/components/Illustration";
import { commitments, formatMoney, getMoneyPlan } from "@/data/money-plan";
import { spending, spendingTotalCents, weeklyCheckIns } from "@/data/spending";

export default function Benefits() {
  return (
    <section id="benefits" className="benefits-section" aria-labelledby="benefits-title">
      <div className="benefits-intro" data-reveal>
        <h2 id="benefits-title">Your money. All in view.</h2>
        <p>One place for everyday spending, upcoming plans, and small habits.</p>
      </div>
      <div className="benefit-cards">
        <article className="benefit-card" data-reveal>
          <Illustration name="spending" />
          <h3>See where it goes.</h3>
          <p>Notice everyday patterns without good-spending, bad-spending labels.</p>
          <div data-ui className="card-data">
            <div className="card-figure"><strong>{formatMoney(spendingTotalCents)}</strong><span>spent this week</span></div>
            <ul className="compact-money-list">{spending.map((row) => <li key={row.category}><span>{row.category}</span><span>{formatMoney(row.amountCents)}</span></li>)}</ul>
            <p className="data-note">17–23 Oct. Already reflected in the example balance.</p>
          </div>
        </article>
        <article className="benefit-card featured-card" data-reveal>
          <Illustration name="upcomingBills" />
          <h3>Plan a little ahead.</h3>
          <p>Your balance and your next expenses belong in the same picture.</p>
          <div data-ui className="card-data">
            <div className="card-figure"><strong>{formatMoney(getMoneyPlan(false).commitmentsCents)}</strong><span>base commitments</span></div>
            <ul className="compact-money-list">{commitments.map((expense) => <li key={expense.id}><span>{expense.name}<small>{expense.date.slice(-2)} Oct</small></span><span>{formatMoney(expense.amountCents)}</span></li>)}</ul>
            <p className="data-note">24–31 Oct. Before the optional bike repair.</p>
          </div>
        </article>
        <article className="benefit-card" data-reveal>
          <Illustration name="weeklyHabit" />
          <h3>Keep a small habit.</h3>
          <p>A weekly look at your money is a useful place to start. Come back when you can.</p>
          <div data-ui className="card-data">
            <div className="card-figure"><strong>{weeklyCheckIns.filter(Boolean).length}<span className="figure-denominator"> / {weeklyCheckIns.length}</span></strong><span>weekly check-ins</span></div>
            <div className="habit-weeks">{weeklyCheckIns.map((done, index) => <div key={index}><span className={done ? "habit-mark is-complete" : "habit-mark"}>{done ? "Done" : "Open"}</span><span>Week {index + 1}</span></div>)}</div>
            <p className="data-note">October. Missed a week? You can start again.</p>
          </div>
        </article>
      </div>
      <p className="section-note">All figures and progress shown are fictional examples.</p>
    </section>
  );
}
