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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BudgetDialog() {
    const { addBudget, refreshBudgets, categories, refreshCategories } = useDataStore();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<number | null>(null);

    // load categories if empty
    useEffect(() => {
        if (!categories.length) {
            refreshCategories();
        }
    }, [categories.length, refreshCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!categoryId) return;

        await addBudget({
            name,
            amount,
            category: categoryId,
            month: new Date().toISOString().slice(0, 10).replace(/-\d+$/, "-01"), // first day of month
        });

        await refreshBudgets();
        setOpen(false);

        // reset form
        setName("");
        setAmount(0);
        setCategoryId(null);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Budget</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new budget</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Budget Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Food Budget"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            placeholder="5000"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(val: string) => setCategoryId(Number(val))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full">
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
