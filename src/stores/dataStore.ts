import { create } from "zustand";
import { createAccount, createBudget, createCategory, createGoal, createTransactionApi, deleteAccount, deleteBudget, deleteCategory, deleteGoal, deleteTransaction, listAccounts, listBudgets, listCategories, listCurrentBudgets, listGoals, listTransactions, replaceAccount, replaceBudget, replaceCategory, replaceGoal, replaceTransaction, retrieveAccount, retrieveBudget, retrieveCategory, retrieveGoal, retrieveTransaction, updateAccount, updateBudget, updateCategory, updateGoal, updateTransaction, type Account, type AccountCreate, type Budget, type BudgetCreate, type Category, type CategoryCreate, type Goal, type GoalCreate, type Transaction, type TransactionCreate, type TransactionFilters } from "../api/axios";



interface DataState {
    // entities
    accounts: Account[];
    categories: Category[];
    fetchAccounts: () => Promise<void>;
    createAccount: (data: AccountCreate) => Promise<Account>;
    hasAccount: () => boolean;
    transactions: Transaction[];
    budgets: Budget[];
    currentBudgets: Budget[];
    goals: Goal[];


    // loading flags
    loading: boolean;
    error: string | null;


    // bulk
    loadAll: () => Promise<void>;


    // Accounts
    refreshAccounts: () => Promise<void>;
    getAccountById: (id: number) => Promise<Account>;
    addAccount: (payload: AccountCreate) => Promise<Account>;
    editAccount: (id: number, payload: Partial<AccountCreate>) => Promise<Account>;
    replaceAccount: (id: number, payload: AccountCreate) => Promise<Account>;
    removeAccount: (id: number) => Promise<void>;


    // Categories
    refreshCategories: () => Promise<void>;
    getCategoryById: (id: number) => Promise<Category>;
    addCategory: (payload: CategoryCreate) => Promise<Category>;
    editCategory: (
        id: number,
        payload: Partial<CategoryCreate>
    ) => Promise<Category>;
    replaceCategory: (id: number, payload: CategoryCreate) => Promise<Category>;
    removeCategory: (id: number) => Promise<void>;


    // Transactions
    refreshTransactions: (filters?: TransactionFilters) => Promise<void>;
    getTransactionById: (id: number) => Promise<Transaction>;
    addTransaction: (payload: TransactionCreate) => Promise<Transaction>;
    editTransaction: (
        id: number,
        payload: Partial<TransactionCreate>
    ) => Promise<Transaction>;
    replaceTransaction: (
        id: number,
        payload: TransactionCreate
    ) => Promise<Transaction>;
    removeTransaction: (id: number) => Promise<void>;


    // Budgets
    refreshBudgets: () => Promise<void>;
    refreshCurrentBudgets: () => Promise<void>;
    getBudgetById: (id: number) => Promise<Budget>;
    addBudget: (payload: BudgetCreate) => Promise<Budget>;
    editBudget: (id: number, payload: Partial<BudgetCreate>) => Promise<Budget>;
    replaceBudget: (id: number, payload: BudgetCreate) => Promise<Budget>;
    removeBudget: (id: number) => Promise<void>;

    // ✅ NEW: Calculate progress
    getBudgetProgress: (budgetId: number) => {
        spent: number;
        limit: number;
        left: number;
        pct: number;
    };

    // Goals
    refreshGoals: () => Promise<void>;
    getGoalById: (id: number) => Promise<Goal>;
    addGoal: (payload: GoalCreate) => Promise<Goal>;
    editGoal: (id: number, payload: Partial<GoalCreate>) => Promise<Goal>;
    replaceGoal: (id: number, payload: GoalCreate) => Promise<Goal>;
    removeGoal: (id: number) => Promise<void>;
}



export const useDataStore = create<DataState>((set, get) => ({
    accounts: [],
    categories: [],
    transactions: [],
    budgets: [],
    currentBudgets: [],
    goals: [],


    loading: false,
    error: null,

    fetchAccounts: async () => {
        const accounts = await listAccounts();
        set({ accounts });
    },

    createAccount: async (data: AccountCreate) => {
        const created = await createAccount(data);
        set({ accounts: [...get().accounts, created] });
        return created;
    },

    hasAccount: () => {
        return get().accounts.length > 0;
    },


    // ---------- Bulk loader ----------
    loadAll: async () => {
        set({ loading: true, error: null });
        try {
            const [accounts, categories, transactions, budgets, currentBudgets, goals] =
                await Promise.all([
                    listAccounts(),
                    listCategories(),
                    listTransactions(),
                    listBudgets(),
                    listCurrentBudgets(),
                    listGoals(),
                ]);
            set({ accounts, categories, transactions, budgets, currentBudgets, goals, loading: false });
        } catch (e: any) {
            set({ loading: false, error: e?.message ?? "Failed to load data" });
        }
    },


    // ---------- Accounts ----------
    refreshAccounts: async () => {
        const accounts = await listAccounts();
        set({ accounts });
    },
    getAccountById: async (id) => {
        return await retrieveAccount(id);
    },
    addAccount: async (payload) => {
        const created = await createAccount(payload);
        set({ accounts: [...get().accounts, created] });
        return created;
    },
    editAccount: async (id, payload) => {
        const updated = await updateAccount(id, payload);
        set({
            accounts: get().accounts.map((a) => (a.id === id ? updated : a)),
        });
        return updated;
    },
    replaceAccount: async (id, payload) => {
        const updated = await replaceAccount(id, payload);
        set({ accounts: get().accounts.map((a) => (a.id === id ? updated : a)) });
        return updated;
    },
    removeAccount: async (id) => {
        await deleteAccount(id);
        set({ accounts: get().accounts.filter((a) => a.id !== id) });
    },
    // ---------- Categories ----------
    refreshCategories: async () => {
        const categories = await listCategories();
        set({ categories });
    },
    getCategoryById: async (id) => {
        return await retrieveCategory(id);
    },
    addCategory: async (payload) => {
        const created = await createCategory(payload);
        set({ categories: [...get().categories, created] });
        return created;
    },
    editCategory: async (id, payload) => {
        const updated = await updateCategory(id, payload);
        set({ categories: get().categories.map((c) => (c.id === id ? updated : c)) });
        return updated;
    },
    replaceCategory: async (id, payload) => {
        const updated = await replaceCategory(id, payload);
        set({ categories: get().categories.map((c) => (c.id === id ? updated : c)) });
        return updated;
    },
    removeCategory: async (id) => {
        await deleteCategory(id);
        set({ categories: get().categories.filter((c) => c.id !== id) });
    },

    // ---------- Transactions ----------
    refreshTransactions: async (filters) => {
        const transactions = await listTransactions(filters);
        set({ transactions });
    },
    getTransactionById: async (id) => {
        return await retrieveTransaction(id);
    },
    addTransaction: async (payload) => {
        const created = await createTransactionApi(payload);

        // Optimistic update
        set({ transactions: [created, ...get().transactions] });

        await get().refreshAccounts();

        if (created.type === "expense") {
            // 🔑 also refresh transactions so budget progress uses latest
            await get().refreshTransactions();
            await get().refreshCurrentBudgets();
        }

        return created;
    },
    editTransaction: async (id, payload) => {
        const updated = await updateTransaction(id, payload);
        set({ transactions: get().transactions.map((t) => (t.id === id ? updated : t)) });
        return updated;
    },
    replaceTransaction: async (id, payload) => {
        const updated = await replaceTransaction(id, payload);
        set({ transactions: get().transactions.map((t) => (t.id === id ? updated : t)) });
        return updated;
    },
    removeTransaction: async (id) => {
        await deleteTransaction(id);
        set({ transactions: get().transactions.filter((t) => t.id !== id) });
    },


    // ---------- Budgets ----------
    refreshBudgets: async () => {
        const budgets = await listBudgets();
        set({ budgets });
    },
    refreshCurrentBudgets: async () => {
        const currentBudgets = await listCurrentBudgets();
        set({ currentBudgets });
    },
    getBudgetById: async (id) => {
        return await retrieveBudget(id);
    },
    addBudget: async (payload) => {
        const created = await createBudget(payload);
        set({ budgets: [...get().budgets, created] });
        return created;
    },
    editBudget: async (id, payload) => {
        const updated = await updateBudget(id, payload);
        set({ budgets: get().budgets.map((b) => (b.id === id ? updated : b)) });
        return updated;
    },
    replaceBudget: async (id, payload) => {
        const updated = await replaceBudget(id, payload);
        set({ budgets: get().budgets.map((b) => (b.id === id ? updated : b)) });
        return updated;
    },
    removeBudget: async (id) => {
        await deleteBudget(id);
        set({ budgets: get().budgets.filter((b) => b.id !== id) });
    },

    // ✅ NEW: Calculate progress
    getBudgetProgress: (budgetId: number) => {
        const budget = get().currentBudgets.find((b) => b.id === budgetId);
        if (!budget) return { spent: 0, limit: 0, left: 0, pct: 0 };

        const bCatId = typeof budget.category === "number" ? budget.category : budget.category.id;

        const spent = get().transactions
            .filter((t) => {
                if (t.type !== "expense") return false;
                const tCatId = typeof t.category === "number" ? t.category : t.category.id;
                return tCatId === bCatId;
            })
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const limit = parseFloat(budget.amount as string);
        const left = limit - spent;
        const pct = limit > 0 ? (spent / limit) * 100 : 0;

        return { spent, limit, left, pct };
    },

    // ---------- Goals ----------
    refreshGoals: async () => {
        const goals = await listGoals();
        set({ goals });
    },
    getGoalById: async (id) => {
        return await retrieveGoal(id);
    },
    addGoal: async (payload) => {
        const created = await createGoal(payload);
        set({ goals: [...get().goals, created] });
        return created;
    },
    editGoal: async (id, payload) => {
        const updated = await updateGoal(id, payload);
        set({ goals: get().goals.map((g) => (g.id === id ? updated : g)) });
        return updated;
    },
    replaceGoal: async (id, payload) => {
        const updated = await replaceGoal(id, payload);
        set({ goals: get().goals.map((g) => (g.id === id ? updated : g)) });
        return updated;
    },
    removeGoal: async (id) => {
        await deleteGoal(id);
        set({ goals: get().goals.filter((g) => g.id !== id) });
    },
}));