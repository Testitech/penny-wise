import Image, { type StaticImageData } from "next/image";
import spending from "../../assets/illustrations/spending.png";
import nextMove from "../../assets/illustrations/next-move.png";
import upcomingBills from "../../assets/illustrations/upcoming-bills.png";
import weeklyHabit from "../../assets/illustrations/weekly-habit.png";
import moneyProcess from "../../assets/illustrations/money-process.png";
import waitlistInvitation from "../../assets/illustrations/waitlist-invitation.png";

const illustrations: Record<string, { image: StaticImageData; alt: string }> = {
  spending: { image: spending, alt: "Hands sorting receipts beside groceries, a coffee cup, and a transport ticket." },
  nextMove: { image: nextMove, alt: "A city bicycle with repair tools and a blank expense slip." },
  upcomingBills: { image: upcomingBills, alt: "A desk calendar with an upcoming day circled, surrounded by bill envelopes." },
  weeklyHabit: { image: weeklyHabit, alt: "An open notebook with three completed checkmarks and one open checkbox beside an orange pencil." },
  moneyProcess: { image: moneyProcess, alt: "Receipts, a calendar, and a money notebook arranged together on a desk." },
  waitlistInvitation: { image: waitlistInvitation, alt: "A hand placing an invitation into an envelope with an orange circular seal." },
};

type IllustrationProps = {
  name: "spending" | "nextMove" | "upcomingBills" | "weeklyHabit" | "moneyProcess" | "waitlistInvitation";
  compact?: boolean;
};

export default function Illustration({ name, compact = false }: IllustrationProps) {
  const asset = illustrations[name];
  return (
    <div className={compact ? "editorial-art editorial-art-compact" : "editorial-art"}>
      <Image src={asset.image} alt={asset.alt} sizes={compact ? "(max-width: 640px) 85vw, 360px" : "(max-width: 640px) 90vw, (max-width: 1100px) 48vw, 600px"} />
    </div>
  );
}
