import { describeRemainder, formatNaira, formatSignedNaira, type CheckResult } from "@/lib/next-move-check";
import styles from "./NextMoveCheck.module.css";

type Props = { result: CheckResult };

export default function NextMoveResult({ result }: Props) {
  return (
    <section className={styles.result} aria-labelledby="result-title">
      <h2 id="result-title">Your estimate</h2>
      <div className={styles.resultStep}>
        <h3>Before the possible expense</h3>
        <p className={styles.figure}>{describeRemainder(result.beforeExpense)}</p>
        <p className={styles.equation}>
          {formatNaira(result.available)} available − {formatNaira(result.commitments)} in costs
        </p>
      </div>
      {result.possibleExpense !== null && result.afterExpense !== null && (
        <div className={styles.resultStep}>
          <h3>After the possible expense</h3>
          <p className={styles.figure}>{describeRemainder(result.afterExpense)}</p>
          <p className={styles.equation}>
            {formatSignedNaira(result.beforeExpense)} before expense − {formatNaira(result.possibleExpense)} possible expense = {formatSignedNaira(result.afterExpense)}
          </p>
        </div>
      )}
      <p className={styles.limit}>
        Based only on what you entered. Other spending, pending charges, and changes in income are not included.
      </p>
    </section>
  );
}
