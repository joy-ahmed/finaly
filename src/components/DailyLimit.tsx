"use client";

import { useEffect, useState } from "react";
import { useDataStore } from "@/stores/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function DailyLimit({ className }: { className?: string }) {
  const { currentBudgets, refreshCurrentBudgets, getBudgetProgress } = useDataStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      await refreshCurrentBudgets();
      setLoading(false);
    };
    fetchBudgets();
  }, [refreshCurrentBudgets]);

  if (loading) {
    // 🔹 Skeleton same size as card
    return (
      <Card className="col-span-1 bg-gray-800 border-0 p-6">
        <CardHeader>
          <CardTitle className="text-white">Daily Limit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-20 bg-gray-700" />
            <Skeleton className="h-4 w-24 bg-gray-700" />
          </div>
          <Skeleton className="h-2 w-full rounded bg-gray-700" />
          <Skeleton className="h-3 w-28 bg-gray-700" />
        </CardContent>
      </Card>
    );
  }

  if (!currentBudgets || currentBudgets.length === 0) {
    return (
      <Card className="col-span-1 bg-gray-800 border-0 text-white">
        <CardHeader>
          <CardTitle>Daily Limit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No budget set for this month.</p>
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
    <Card className={`col-span-1 bg-gray-800 text-white border-0 ${className}`}>
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
        <Progress value={pct} className="h-2 bg-gray-600"  />
        <div className="text-gray-400">
          {totalLeft >= 0
            ? `${totalLeft.toFixed(2)} left`
            : `${Math.abs(totalLeft).toFixed(2)} overspent`}
        </div>
      </CardContent>
    </Card>
  );
}
