"use client";

import { createContext, useContext, useState } from "react";

const MoneyPlanContext = createContext<{
  includeRepair: boolean;
  setIncludeRepair: (value: boolean) => void;
} | null>(null);

export function MoneyPlanProvider({ children }: { children: React.ReactNode }) {
  const [includeRepair, setIncludeRepair] = useState(false);
  return <MoneyPlanContext.Provider value={{ includeRepair, setIncludeRepair }}>{children}</MoneyPlanContext.Provider>;
}

export function useMoneyPlan() {
  const context = useContext(MoneyPlanContext);
  if (!context) throw new Error("Money plan requires its provider.");
  return context;
}
