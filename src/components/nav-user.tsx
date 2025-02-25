"use client";

import { logoutAction } from "@/app/(auth)/action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ADMIN_ROUTE, CASHIER_ROUTE, WORKER_ROUTE } from "@/lib/const";
import { cn } from "@/lib/utils";
import {
  BriefcaseBusiness,
  ChevronsUpDown,
  Home,
  LayoutDashboard,
  LogOut,
  Store,
} from "lucide-react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
  side,
  className,
}: {
  user: User;
  side?: "bottom" | "right" | "top" | "left";
  className?: string;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                className
              )}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback className="rounded-lg">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                  {user.name?.charAt(1).toUpperCase() || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : side || "right"}
            align="end"
            sideOffset={4}
          >
            {["ROOT", "ADMIN"].includes(user.role) && (
              <DropdownMenuItem>
                <button
                  onClick={() => router.push(ADMIN_ROUTE)}
                  className="flex items-center"
                >
                  <LayoutDashboard className="mr-2 size-4" />
                  <span>Admin</span>
                </button>
              </DropdownMenuItem>
            )}
            {["ROOT", "ADMIN", "CASHIER"].includes(user.role) && (
              <DropdownMenuItem>
                <button
                  onClick={() => router.push(CASHIER_ROUTE)}
                  className="flex items-center"
                >
                  <Store className="mr-2 size-4" />
                  <span>Kasir</span>
                </button>
              </DropdownMenuItem>
            )}
            {["ROOT", "ADMIN", "WORKER"].includes(user.role) && (
              <DropdownMenuItem>
                <button
                  onClick={() => router.push(WORKER_ROUTE)}
                  className="flex items-center"
                >
                  <BriefcaseBusiness className="mr-2 size-4" />
                  <span>Pekerjaan</span>
                </button>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <button
                onClick={() => router.push("/")}
                className="flex items-center"
              >
                <Home className="mr-2 size-4" />
                <span>Home</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form action={logoutAction}>
                <button type="submit" className="flex items-center">
                  <LogOut className="mr-2 size-4" />
                  <span>Logout</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
