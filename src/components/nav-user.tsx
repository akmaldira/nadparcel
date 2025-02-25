"use client";

import { logoutAction } from "@/app/(auth)/action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ADMIN_ROUTE,
  CASHIER_ROUTE,
  INDEX_ROUTE,
  WORKER_ROUTE,
} from "@/lib/const";
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
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function NavUser({
  user,
  side,
  className,
}: {
  user: User;
  side?: "bottom" | "right" | "top" | "left";
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-12",
            className
          )}
          variant="ghost"
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
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={side || "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuItem
          className={cn("flex items-center", pathname == "/" && "bg-accent")}
          onClick={() => {
            router.push(INDEX_ROUTE);
          }}
        >
          <Home className="size-4" />
          <span>Home</span>
        </DropdownMenuItem>
        {["ROOT", "ADMIN"].includes(user.role) && (
          <DropdownMenuItem
            className={cn(
              "flex items-center",
              pathname.startsWith(ADMIN_ROUTE) && "bg-accent"
            )}
            onClick={() => {
              router.push(ADMIN_ROUTE);
            }}
          >
            <LayoutDashboard className="size-4" />
            <span>Admin</span>
          </DropdownMenuItem>
        )}
        {["ROOT", "ADMIN", "CASHIER"].includes(user.role) && (
          <DropdownMenuItem
            className={cn(
              "flex items-center",
              pathname.startsWith(CASHIER_ROUTE) && "bg-accent"
            )}
            onClick={() => {
              router.push(CASHIER_ROUTE);
            }}
          >
            <Store className="size-4" />
            <span>Kasir</span>
          </DropdownMenuItem>
        )}
        {["ROOT", "ADMIN", "WORKER"].includes(user.role) && (
          <DropdownMenuItem
            className={cn(
              "flex items-center",
              pathname.startsWith(WORKER_ROUTE) && "bg-accent"
            )}
            onClick={() => {
              router.push(WORKER_ROUTE);
            }}
          >
            <BriefcaseBusiness className="size-4" />
            <span>Pekerjaan</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={logoutAction} className="w-full">
            <button type="submit" className="flex items-center w-full gap-2">
              <LogOut className="size-4" />
              <span>Logout</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
