"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Illustration from "@/components/Illustration";

const subscribe = () => () => {};

export default function WaitlistForm() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  return (
    <section id="waitlist" className="waitlist-section illustrated-waitlist page-section" aria-labelledby="waitlist-title">
      <div className="waitlist-copy" data-reveal>
        <Illustration name="waitlistInvitation" compact />
        <h2 id="waitlist-title">Your next move<br />starts here.</h2>
        <p>A clearer relationship with your money. A little more confidence in what comes next.</p>
      </div>
      <div className="waitlist-form-wrap" data-reveal>
        <p id="waitlist-disclosure">Try the form without signing up. No email is sent or saved.</p>
        <form noValidate onSubmit={(event) => {
          event.preventDefault();
          const email = emailRef.current;
          if (!email || !email.validity.valid) {
            setError(email?.validity.valueMissing
              ? "Enter an email address to try the demo."
              : "Use an email address like you@example.com.");
            setSuccess(false);
            email?.focus();
            return;
          }
          event.currentTarget.reset();
          setError("");
          setSuccess(true);
        }}>
          <fieldset disabled={!ready}>
            <label htmlFor="waitlist-email">Email address</label>
            <div className="waitlist-fields">
              <input ref={emailRef} id="waitlist-email" type="email" required autoComplete="off" placeholder="you@example.com" aria-invalid={Boolean(error)} aria-describedby={`waitlist-disclosure${error ? " waitlist-error" : ""}`} onInput={() => { setError(""); setSuccess(false); }} />
              <button type="submit">Try waitlist demo</button>
            </div>
          </fieldset>
          {error && <p id="waitlist-error" className="form-message" role="alert">{error}</p>}
          <p className="form-message" role="status" aria-live="polite">{success ? "Demo complete. Email cleared; no signup created." : "Fictional product. This form is a demonstration."}</p>
        </form>
        <noscript><p>This demo needs JavaScript. The form is disabled and no email will be sent.</p></noscript>
      </div>
    </section>
  );
}
