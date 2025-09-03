"use client";

import { useState } from "react";
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

export function CreateAccountDialog() {
  const { createAccount, fetchAccounts } = useDataStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("BDT");
  const [balance, setBalance] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createAccount({
      name,
      currency,
      balance: Number(balance), // ✅ ensure number type
      notes: "",
    });

    await fetchAccounts();
    setOpen(false);

    // reset form
    setName("");
    setCurrency("BDT");
    setBalance(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Savings"
              required
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="USD"
              required
            />
          </div>
          <div>
            <Label htmlFor="balance">Balance</Label>
            <Input
              id="balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value))}
              placeholder="0.00"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
