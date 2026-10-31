import type { Metadata } from "next";
import Link from "next/link";
import NextMoveCheck from "@/components/NextMoveCheck";
import styles from "@/components/NextMoveCheck.module.css";

export const metadata: Metadata = {
  title: "Next Move Check | Pennywise",
  description: "Estimate what may remain after costs before your next income and one possible expense, in Nigerian naira.",
};

export default function NextMoveCheckPage() {
  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <Link href="/" className="wordmark" aria-label="Pennywise home">pennywise</Link>
        <Link href="/" className={styles.backLink}>Back to landing</Link>
      </div>
      <NextMoveCheck />
    </main>
  );
}
