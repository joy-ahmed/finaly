"use client";

import { useEffect } from "react";
import { useDataStore } from "@/stores/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DailyLimit() {
  const { currentBudgets, refreshCurrentBudgets, getBudgetProgress } = useDataStore();

  useEffect(() => {
    refreshCurrentBudgets();
  }, [refreshCurrentBudgets]);

  if (!currentBudgets || currentBudgets.length === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Total Limit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No budget set for this month.</p>
        </CardContent>
      </Card>
    );
  }

  // 🔑 Combine all budgets into totals
  let totalLimit = 0;
  let totalSpent = 0;

  currentBudgets.forEach((budget) => {
    const { spent } = getBudgetProgress(budget.id);
    totalLimit += parseFloat(budget.amount as any);
    totalSpent += spent;
  });

  const totalLeft = totalLimit - totalSpent;
  const pct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  return (
    <Card className="col-span-1 bg-gray-800 text-white border-0">
      <CardHeader>
        <CardTitle>Daily Limit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Total</span>
          <span>
            {totalSpent.toFixed(2)} / {totalLimit.toFixed(2)}
          </span>
        </div>
        <Progress value={pct} className="h-2" />
        <div className="text-xs text-gray-400">
          {totalLeft >= 0
            ? `${totalLeft.toFixed(2)} left`
            : `${Math.abs(totalLeft).toFixed(2)} overspent`}
        </div>
      </CardContent>
    </Card>
  );
}
