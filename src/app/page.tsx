import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import ExpenseShowcase from "@/components/ExpenseShowcase";
import HowItWorks from "@/components/HowItWorks";
import WaitlistForm from "@/components/WaitlistForm";
import Motion from "@/components/Motion";
import { MoneyPlanProvider } from "@/components/MoneyPlanProvider";

export default function HomePage() {
  return (
    <div className="reference-layout">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="site-header">
        <a href="#main-content" className="wordmark" aria-label="Pennywise home">pennywise</a>
        <nav aria-label="Main navigation"><a href="#preview">The preview</a><a href="#benefits">Benefits</a><a href="#how-it-works">How it works</a></nav>
        <a href="#waitlist" className="header-cta">Waitlist demo</a>
      </header>
      <MoneyPlanProvider>
        <main id="main-content">
          <Hero />
          <ExpenseShowcase />
          <Benefits />
          <HowItWorks />
          <WaitlistForm />
        </main>
      </MoneyPlanProvider>
      <footer className="site-footer">
        <a href="#main-content" className="wordmark">pennywise</a>
        <nav aria-label="Footer navigation"><a href="#preview">Preview</a><a href="#benefits">Benefits</a><a href="#how-it-works">How it works</a></nav>
        <p>Fictional product. Real clarity.</p>
      </footer>
      <Motion />
    </div>
  );
}
