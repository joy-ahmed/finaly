"use client";

import { useEffect, useMemo } from "react";
import { useDataStore } from "@/stores/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StatsCard = () => {
  const { accounts, transactions, refreshTransactions } = useDataStore();

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  if (!accounts || accounts.length === 0 || !transactions) {
    return (
      <Card className="bg-gray-800 rounded-lg p-6 space-y-4 col-span-1 border-0">
        <CardHeader>
          <CardTitle>Total (loading...)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="bg-gray-800/40 backdrop-blur-lg border border-gray-700"
              >
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Calculate dynamic date range
  const dateRange = useMemo(() => {
    if (!transactions || transactions.length === 0) return "";

    const dates = transactions.map((t) => new Date(t.date));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
    };

    return `${minDate.toLocaleDateString("en-GB", options)} - ${maxDate.toLocaleDateString(
      "en-GB",
      options
    )}`;
  }, [transactions]);

  const StatBox = ({
    title,
    value,
    color,
  }: {
    title: string;
    value: string;
    color?: string;
  }) => (
    <Card className="bg-gray-700/40 backdrop-blur-lg border border-gray-600">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm text-gray-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <span className={`text-2xl font-semibold ${color}`}>{value}</span>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-gray-800 rounded-lg p-6 space-y-4 col-span-1 border-0">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">
          Total ({dateRange})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatBox title="Balance" value={`$${totalBalance.toFixed(2)}`} color="text-white" />
          <StatBox
            title="Income"
            value={`+$${totalIncome.toFixed(2)}`}
            color="text-green-400"
          />
          <StatBox
            title="Expenses"
            value={`-$${totalExpenses.toFixed(2)}`}
            color="text-red-400"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
