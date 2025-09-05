"use client";

import { useState, useEffect } from "react";
import { useDataStore } from "@/stores/dataStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

export function CreateTransactionDialog() {
  const {
    addTransaction,
    accounts,
    categories,
    refreshAccounts,
    refreshCategories,
  } = useDataStore();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    refreshAccounts();
    refreshCategories();
  }, [refreshAccounts, refreshCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountId || !categoryId) {
      toast.error("Please select account and category");
      return;
    }

    try {
      await addTransaction({
        account: accountId,
        category: categoryId,
        type,
        amount: Number(amount),
        notes,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      });

      toast.success("Transaction saved ✅");

      setOpen(false);
      setAmount("");
      setNotes("");
      setAccountId(null);
      setCategoryId(null);
      setType("expense");
    } catch (err) {
      toast.error("Failed to save transaction ❌");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 cursor-pointer">
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Add a new transaction
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              className="bg-gray-800 border-gray-700 text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(val: "income" | "expense") => setType(val)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Account</Label>
            <Select
              value={accountId ? String(accountId) : ""}
              onValueChange={(val) => setAccountId(Number(val))}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={String(acc.id)}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Category</Label>
            <Select
              value={categoryId ? String(categoryId) : ""}
              onValueChange={(val) => setCategoryId(Number(val))}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name} ({cat.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              className="bg-gray-800 border-gray-700 text-white"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
