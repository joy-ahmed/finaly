"use client";

import { useEffect } from "react";
import { useDataStore } from "@/stores/dataStore";
import { Progress } from "@/components/ui/progress";
import { BudgetDialog } from "./BudgetDialog";


const DailyLimit = () => {
  const { budgets, refreshBudgets, getBudgetProgress } = useDataStore();

  useEffect(() => {
    refreshBudgets();
  }, [refreshBudgets]);

  if (!budgets.length) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-medium">Budgets</h3>
        <p>No budgets yet.</p>
        <BudgetDialog /> {/* ✅ still allow adding */}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Budgets</h3>
        <BudgetDialog /> {/* Add another budget if needed */}
      </div>

      <div className="space-y-6">
        {budgets.map((budget) => {
          const progress = getBudgetProgress(budget.id);

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{budget.name}</span>
                <span className="text-sm text-gray-400">
                  {new Date(budget.month).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Limit: {budget.amount}</span>
                <span>Spent: {progress.spent}</span>
                <span>Left: {progress.left}</span>
              </div>
              <Progress value={progress.pct} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyLimit;
