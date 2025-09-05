"use client";

import {
  ArrowLeftRight,
  CreditCard,
  Search,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NavUser from "./nav-user";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import { clearTokens, getAccessToken, getMe } from "@/api/axios";
import { CreateAccountDialog } from "@/components/AccountForm";
import { Skeleton } from "@/components/ui/skeleton";

// Menu items
const items = [
  { title: "Dashboard", url: "#", icon: LayoutDashboard },
  { title: "Transactions", url: "#", icon: ArrowLeftRight },
  { title: "Cards", url: "#", icon: CreditCard },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
];

export function AppSidebar() {
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { fetchAccounts, hasAccount } = useDataStore();

  useEffect(() => {
    const restoreUser = async () => {
      if (getAccessToken() && !user) {
        try {
          const me = await getMe();
          setUser(me);
        } catch {
          clearTokens();
        }
      }
      setLoading(false);
    };
    restoreUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user, fetchAccounts]);

  // 🔹 Skeleton while loading
  if (loading) {
    return (
      <Sidebar className="bg-gray-800">
        <SidebarContent className="bg-gray-800">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xl text-center text-white mb-6">
              <Skeleton className="h-6 w-24 mx-auto" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded my-2 bg-gray-700" />
              ))}
            </SidebarGroupContent>
            <SidebarFooter className="mt-auto">
              <Skeleton className="h-12 w-full rounded bg-gray-700 mb-2" />
            </SidebarFooter>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="bg-gray-800 flex flex-col h-full">
      <SidebarContent className="bg-gray-800 flex flex-col flex-1">
        <SidebarGroup className="flex flex-col flex-1">
          {/* Logo / Brand */}
          <SidebarGroupLabel className="text-xl text-center text-white mb-6 mt-4">
            <img src="/finaly.png" alt="Logo" className="h-8" />
          </SidebarGroupLabel>

          {/* Menu items */}
          <SidebarGroupContent className="flex-1 mt-4">
            {hasAccount() ? (
              <SidebarMenu className="text-white flex flex-col gap-2">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <div className="flex flex-col items-center gap-4 py-6 text-white">
                <p className="text-sm text-gray-300">You don’t have any accounts yet.</p>
                <CreateAccountDialog />
              </div>
            )}
          </SidebarGroupContent>

          {/* Avatar at the bottom */}
          <SidebarFooter className="mt-auto">
            {user && <NavUser user={user} />}
          </SidebarFooter>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
