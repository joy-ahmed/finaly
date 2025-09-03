import { create } from "zustand";
import type { LoginResponse, UserInfo } from "../api/axios";

interface AuthState {
  user: LoginResponse | UserInfo | null;
  setUser: (user: LoginResponse | UserInfo | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));