import axios, { AxiosError } from "axios";

// --- Types ---
export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  username: string;
  access: string;
  refresh: string;
}

export interface UserInfo {
  id: number;
  email: string;
  username: string;
}



export type Money = string; // DRF DecimalField commonly serializes as string
export type ISODate = string; // e.g., "2025-09-02" or full ISO timestamp


export type CategoryType = "income" | "expense";
export type TransactionType = CategoryType;


export interface Account {
id: number;
user?: number; // backend sets this from request.user
name: string;
balance: Money; // Decimal string
currency: string; // e.g., "BDT"
notes: string;
created_at: ISODate;
updated_at: ISODate;
}


export interface AccountCreate {
name: string;
balance?: Money | number; // send as number or string; server accepts Decimal
currency?: string;
notes?: string;
}


export interface Category {
id: number;
user?: number;
name: string;
type: CategoryType;
}


export interface CategoryCreate {
name: string;
type: CategoryType;
}

// Your serializer may return nested objects for account/category in transactions.
// We'll support both id or object for safety.
export interface Transaction {
id: number;
user?: number;
account: number | Account;
category: number | Category;
amount: Money;
type: TransactionType;
notes: string;
date: ISODate; // YYYY-MM-DD
created_at: ISODate;
updated_at: ISODate;
}


export interface TransactionCreate {
account: number; // id
category: number; // id
amount: Money | number;
type: TransactionType;
notes?: string;
date: ISODate; // YYYY-MM-DD
}


export interface Budget {
id: number;
user?: number;
name: string;
amount: Money;
category: number | Category;
month: ISODate; // first day of month, e.g., "2025-09-01"
}


export interface BudgetCreate {
name: string;
amount: Money | number;
category: number; // id
month: ISODate; // first day of month
}


export interface Goal {
id: number;
user?: number;
name: string;
target_amount: Money;
current_amount: Money;
target_date: ISODate | null;
created_at: ISODate;
}


export interface GoalCreate {
name: string;
target_amount: Money | number;
current_amount?: Money | number;
target_date?: ISODate | null;
}


// --- Token Helpers ---
const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";

const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// --- Axios Instance ---
const api = axios.create({
  baseURL: "https://fcs-api.onrender.com/api",
  timeout: 15000,
});

// --- Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor (optional: handle token refresh) ---
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Example: handle 401 errors and try to refresh token
    if (
      error.response?.status === 401 &&
      getRefreshToken() &&
      !error.config?.url?.includes("/auth/login")
    ) {
      // TODO: Implement token refresh logic here
      // If refresh fails, clear tokens and redirect to login
      clearTokens();
      // Optionally: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// --- API Functions ---
export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>("/auth/register/", data);
    return response.data;
  } catch (error) {
    // Optionally handle error (e.g., show notification)
    throw error;
  }
};

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login/", data);
    // Save tokens for future requests
    setTokens(response.data.access, response.data.refresh);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMe = async (): Promise<UserInfo> => {
  const response = await api.get<UserInfo>("/auth/me/");
  return response.data;
};

//  ---------------------- Account CRUD ----------------------
export const listAccounts = async ():Promise<Account[]> => {
  const res = await api.get<Account[]>("/accounts/");
  return res.data;
}

export const retrieveAccount = async (id: number): Promise<Account> => {
const res = await api.get<Account>(`/accounts/${id}/`);
return res.data;
};


export const createAccount = async (
data: AccountCreate
): Promise<Account> => {
const res = await api.post<Account>("/accounts/", data);
return res.data;
};
export const updateAccount = async (
id: number,
data: Partial<AccountCreate>
): Promise<Account> => {
const res = await api.patch<Account>(`/accounts/${id}/`, data);
return res.data;
};


export const replaceAccount = async (
id: number,
data: AccountCreate
): Promise<Account> => {
const res = await api.put<Account>(`/accounts/${id}/`, data);
return res.data;
};


export const deleteAccount = async (id: number): Promise<void> => {
await api.delete(`/accounts/${id}/`);
};

// ---------------- Categories CRUD ----------------
export const listCategories = async (): Promise<Category[]> => {
const res = await api.get<Category[]>("/categories/");
return res.data;
};


export const retrieveCategory = async (id: number): Promise<Category> => {
const res = await api.get<Category>(`/categories/${id}/`);
return res.data;
}



export const createCategory = async (data: CategoryCreate): Promise<Category> => {
const res = await api.post<Category>("/categories/", data);
return res.data;
};


export const updateCategory = async (
id: number,
data: Partial<CategoryCreate>
): Promise<Category> => {
const res = await api.patch<Category>(`/categories/${id}/`, data);
return res.data;
};


export const replaceCategory = async (
id: number,
data: CategoryCreate
): Promise<Category> => {
const res = await api.put<Category>(`/categories/${id}/`, data);
return res.data;
};


export const deleteCategory = async (id: number): Promise<void> => {
await api.delete(`/categories/${id}/`);
};

// ---------------- Transactions CURD -------------------

export interface TransactionFilters {
  type?: TransactionType; 
  "category__id"?: number;
  date?: string;
}

export const listTransactions = async (filters?: TransactionFilters): Promise<Transaction[]> => {
  const res = await api.get<Transaction[]>("/transactions/", { params: filters });
  return res.data;
};

export const retrieveTransaction = async (id: number): Promise<Transaction> => {
  const res = await api.get<Transaction>(`/transactions/${id}/`);
  return res.data;
};

export const createTransactionApi = async (data: TransactionCreate): Promise<Transaction> => {
  const res = await api.post<Transaction>("/transactions/", data);
  return res.data;
};

export const updateTransaction = async (
  id: number,
  data: Partial<TransactionCreate>
): Promise<Transaction> => {
  const res = await api.patch<Transaction>(`/transactions/${id}/`, data);
  return res.data;
};

export const replaceTransaction = async (
  id: number,
  data: TransactionCreate
): Promise<Transaction> => {
  const res = await api.put<Transaction>(`/transactions/${id}/`, data);
  return res.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/transactions/${id}/`);
};


// ---------------- Budgets CRUD + current ----------------
export const listBudgets = async (): Promise<Budget[]> => {
const res = await api.get<Budget[]>("/budgets/");
return res.data;
};


export const retrieveBudget = async (id: number): Promise<Budget> => {
const res = await api.get<Budget>(`/budgets/${id}/`);
return res.data;
};


export const createBudget = async (data: BudgetCreate): Promise<Budget> => {
const res = await api.post<Budget>("/budgets/", data);
return res.data;
};


export const updateBudget = async (
id: number,
data: Partial<BudgetCreate>
): Promise<Budget> => {
const res = await api.patch<Budget>(`/budgets/${id}/`, data);
return res.data;
};


export const replaceBudget = async (
id: number,
data: BudgetCreate
): Promise<Budget> => {
const res = await api.put<Budget>(`/budgets/${id}/`, data);
return res.data;
};


export const deleteBudget = async (id: number): Promise<void> => {
await api.delete(`/budgets/${id}/`);
};


export const listCurrentBudgets = async (): Promise<Budget[]> => {
const res = await api.get<Budget[]>("/budgets/current/");
return res.data;
};

// ---------------- Goals CRUD ----------------
export const listGoals = async (): Promise<Goal[]> => {
const res = await api.get<Goal[]>("/goals/");
return res.data;
};


export const retrieveGoal = async (id: number): Promise<Goal> => {
const res = await api.get<Goal>(`/goals/${id}/`);
return res.data;
};


export const createGoal = async (data: GoalCreate): Promise<Goal> => {
const res = await api.post<Goal>("/goals/", data);
return res.data;
};


export const updateGoal = async (
id: number,
data: Partial<GoalCreate>
): Promise<Goal> => {
const res = await api.patch<Goal>(`/goals/${id}/`, data);
return res.data;
};


export const replaceGoal = async (
id: number,
data: GoalCreate
): Promise<Goal> => {
const res = await api.put<Goal>(`/goals/${id}/`, data);
return res.data;
};


export const deleteGoal = async (id: number): Promise<void> => {
await api.delete(`/goals/${id}/`);
};



// --- Token Management Exports ---
export { setTokens, getAccessToken, getRefreshToken, clearTokens };

export default api;
