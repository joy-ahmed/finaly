"use client";

import { useDataStore } from "@/stores/dataStore";

const StatsCard = () => {
  const accounts = useDataStore((state) => state.accounts);

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  // For now, placeholders — you’ll replace with transaction sums later
  const totalIncome = 0.00;
  const totalExpenses = 0.00;

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4 col-span-1">
      <h3 className="text-lg font-medium">Total (1 Apr - 29 Apr)</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Balance</span>
          <span>${totalBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Income</span>
          <span>${totalIncome.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Expenses</span>
          <span>${totalExpenses.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
