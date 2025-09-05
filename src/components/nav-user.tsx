"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { clearTokens } from "@/api/axios";

export function NavUser({
  user,
}: {
  user: {
    username: string;
    email: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-gray-700  hover:bg-gray-700 rounded-md w-full px-2 py-1.5 flex items-center gap-2"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.username} alt={user.username} />
                <AvatarFallback className="rounded-lg text-bold uppercase">
                  {user?.username?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-medium text-white">{user.username}</span>
                <span className="text-gray-400 truncate text-xs">{user.email}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-gray-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-[220px] bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-1"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2 text-left">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.username} alt={user.username} />
                  <AvatarFallback className="rounded-lg text-bold uppercase">
                    {user?.username?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-white">{user.username}</span>
                  <span className="text-gray-400 truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="border-gray-700" />

            <DropdownMenuGroup className="text-gray-200">
              <DropdownMenuItem className="hover:bg-gray-700 rounded-md flex items-center gap-2 px-2 py-1.5">
                <IconUserCircle /> Account
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700 rounded-md flex items-center gap-2 px-2 py-1.5">
                <IconCreditCard /> Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700 rounded-md flex items-center gap-2 px-2 py-1.5">
                <IconNotification /> Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="border-gray-700" />

            <DropdownMenuItem
              className="text-red-500 hover:bg-gray-700 rounded-md flex items-center gap-2 px-2 py-1.5"
              onSelect={() => {
                clearTokens();
                window.location.reload();
              }}
            >
              <IconLogout /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default NavUser;
