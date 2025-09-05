"use client";

import { useEffect, useState } from "react";
import { useDataStore } from "@/stores/dataStore";
import { Skeleton } from "@/components/ui/skeleton";

const ExpensesSummary = () => {
  const { transactions, refreshTransactions, categories } = useDataStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await refreshTransactions();
      setLoading(false);
    };
    fetch();
  }, [refreshTransactions]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 lg:col-span-2">
        <h3 className="text-lg font-medium mb-4">Expenses Summary</h3>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-full bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  // group expenses by category
  const expensesByCategory: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      let categoryName = "Other";

      if (typeof tx.category !== "number" && tx.category?.name) {
        categoryName = tx.category.name;
      } else if (typeof tx.category === "number") {
        // lookup from store
        const cat = categories.find((c) => c.id === tx.category);
        categoryName = cat?.name ?? "Other";
      }

      expensesByCategory[categoryName] =
        (expensesByCategory[categoryName] || 0) + Number(tx.amount);
    });

  // turn into sorted list (largest first)
  const summary = Object.entries(expensesByCategory).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 lg:col-span-2">
      <h3 className="text-lg font-medium mb-4">Expenses Summary</h3>
      {summary.length === 0 ? (
        <p className="text-muted-foreground">No expenses yet.</p>
      ) : (
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="pb-2">Category</th>
              <th className="pb-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(([category, amount]) => (
              <tr key={category} className="border-t border-gray-700">
                <td className="py-2">{category}</td>
                <td>${amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpensesSummary;
