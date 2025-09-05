"use client";

import { useEffect, useState } from "react";
import { useDataStore } from "@/stores/dataStore";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortField = "date" | "amount";
type SortOrder = "asc" | "desc";

const RecentActivity = () => {
  const { transactions, refreshTransactions } = useDataStore();
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    const fetchTx = async () => {
      setLoading(true);
      await refreshTransactions();
      setLoading(false);
    };
    fetchTx();
  }, [refreshTransactions]);

  // toggle sorting
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // get correct icon for header
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 inline" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4 inline" />
    ) : (
      <ArrowDown className="h-4 w-4 inline" />
    );
  };

  // apply sorting
  const sortedTransactions = [...(transactions || [])].sort((a, b) => {
    if (sortField === "date") {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    } else if (sortField === "amount") {
      const aAmt = Number(a.amount);
      const bAmt = Number(b.amount);
      return sortOrder === "asc" ? aAmt - bAmt : bAmt - aAmt;
    }
    return 0;
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>

      {/* Skeleton */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-t border-gray-700 py-2"
            >
              <Skeleton className="h-4 w-24 bg-gray-700" />
              <Skeleton className="h-4 w-20 bg-gray-700" />
              <Skeleton className="h-4 w-16 bg-gray-700" />
              <Skeleton className="h-4 w-12 bg-gray-700" />
            </div>
          ))}
        </div>
      ) : !transactions || transactions.length === 0 ? (
        <p className="text-muted-foreground">No transactions yet.</p>
      ) : (
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="pb-2">Description</th>
              <th className="pb-2">Category</th>
              <th
                className="pb-2 cursor-pointer select-none"
                onClick={() => toggleSort("date")}
              >
                Date {getSortIcon("date")}
              </th>
              <th className="pb-2">Type</th>
              <th
                className="pb-2 cursor-pointer select-none"
                onClick={() => toggleSort("amount")}
              >
                Amount {getSortIcon("amount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((tx) => {
              const categoryName =
                typeof tx.category === "number"
                  ? `#${tx.category}`
                  : tx.category?.name ?? "—";

              return (
                <tr key={tx.id} className="border-t border-gray-700">
                  <td className="py-2">{tx.notes || "—"}</td>
                  <td>{categoryName}</td>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td
                    className={
                      tx.type === "income" ? "text-green-400" : "text-red-400"
                    }
                  >
                    {tx.type}
                  </td>
                  <td>
                    {tx.type === "income" ? "+" : "-"}
                    {Number(tx.amount).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentActivity;
