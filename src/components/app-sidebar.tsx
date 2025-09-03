"use client";

import {
  Calendar,
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
import { Button } from "@/components/ui/button";
import { CreateAccountDialog } from "@/components/AccountForm";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    url: "#",
    icon: ArrowLeftRight,
  },
  {
    title: "Cards",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
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

  if (loading) return null; // or a spinner

  return (
    <Sidebar className="bg-gray-800">
      <SidebarContent className="bg-gray-800">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl text-center text-white">
            Finaly
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {hasAccount() ? (
              <SidebarMenu className="text-white">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <div className="flex flex-col items-center gap-4 py-6 text-white">
                <p className="text-sm text-gray-300">
                  You don’t have any accounts yet.
                </p>
                <CreateAccountDialog />
              </div>
            )}
          </SidebarGroupContent>
          <SidebarFooter>
            {user && <NavUser user={user} />}
          </SidebarFooter>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
