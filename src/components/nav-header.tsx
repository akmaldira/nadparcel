"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  ADMIN_ROUTE,
  CASHIER_ROUTE,
  INDEX_ROUTE,
  WORKER_ROUTE,
} from "@/lib/const";
import { cn } from "@/lib/utils";
import { User } from "next-auth";
import { buttonVariants } from "./ui/button";

export function NavHeader({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-2 *:data-[slot=navigation-menu-item]:h-7 **:data-[slot=navigation-menu-link]:py-1 **:data-[slot=navigation-menu-link]:font-medium">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            data-active={pathname.startsWith("/")}
            className={cn(
              buttonVariants({ variant: "link" }),
              pathname.length == 1 && "font-bold"
            )}
          >
            <Link href={INDEX_ROUTE}>Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {["ROOT", "ADMIN", "WORKER"].includes(user.role) && (
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              data-active={pathname.startsWith(WORKER_ROUTE)}
              className={cn(
                buttonVariants({ variant: "link" }),
                pathname.startsWith(WORKER_ROUTE) && "font-bold"
              )}
            >
              <Link href={WORKER_ROUTE}>Pekerjaan</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        {["ROOT", "ADMIN", "CASHIER"].includes(user.role) && (
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              data-active={pathname.startsWith(CASHIER_ROUTE)}
              className={cn(
                buttonVariants({ variant: "link" }),
                pathname.startsWith(CASHIER_ROUTE) && "font-bold"
              )}
            >
              <Link href={CASHIER_ROUTE}>Kasir</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        {["ROOT", "ADMIN"].includes(user.role) && (
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              data-active={pathname.startsWith(ADMIN_ROUTE)}
              className={cn(
                buttonVariants({ variant: "link" }),
                pathname.startsWith(ADMIN_ROUTE) && "font-bold"
              )}
            >
              <Link href={ADMIN_ROUTE}>Admin</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
