import DashboardPreview from "@/components/DashboardPreview";

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero-layout">
      <div className="hero-copy">
        <h1 id="hero-title">Understand<br />your money.</h1>
        <p className="hero-promise">A little less money stress. A clearer plan for what’s next.</p>
        <p className="hero-description">See your spending and upcoming expenses together in one personal finance app.</p>
        <div className="hero-actions"><a className="preview-action" href="#waitlist">Try waitlist demo</a>
        <a className="hero-secondary" href="#expense-demo">Try money plan</a></div>
        <p className="hero-footnote">A fictional app. A working preview. No bank connection.</p>
      </div>
      <div className="product-stage"><DashboardPreview /></div>
    </section>
  );
}
