"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/type";
import {
  ChevronRightIcon,
  LayoutDashboard,
  LayoutList,
  ShoppingBag,
  ShoppingBasket,
  UserIcon,
} from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { NavUser } from "./nav-user";

export const sidebarItems: Record<string, NavItem> = {
  "/admin/dashboard": {
    type: "item",
    title: "Dashboard",
    url: "/admin",
    acceptedRoles: ["ROOT", "ADMIN"],
    icon: LayoutDashboard,
  },
  "/admin/parcel": {
    type: "group",
    title: "Parsel",
    url: "/admin/parcel",
    acceptedRoles: ["ROOT", "ADMIN"],
    isActive: true,
    icon: ShoppingBag,
    items: [
      {
        title: "Data Parsel",
        url: "/admin/parcel",
      },
      {
        title: "Tambah Parsel",
        url: "/admin/parcel/create",
      },
    ],
  },
  "/admin/cart": {
    type: "item",
    title: "Keranjang",
    url: "/admin/cart",
    acceptedRoles: ["ROOT", "ADMIN"],
    icon: ShoppingBasket,
  },
  "/admin/item": {
    type: "item",
    title: "Item",
    url: "/admin/item",
    acceptedRoles: ["ROOT", "ADMIN"],
    icon: LayoutList,
  },
  "/admin/user": {
    type: "item",
    title: "Pengguna",
    url: "/admin/user",
    acceptedRoles: ["ROOT"],
    icon: UserIcon,
  },
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Halaman</SidebarGroupLabel>
          <SidebarMenu>
            {Object.values(sidebarItems).map((item) =>
              item.type === "group" ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          "text-md",
                          pathname.startsWith(item.url) &&
                            "bg-sidebar-accent mb-[2px]"
                        )}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "text-base",
                                pathname === subItem.url && "bg-sidebar-accent"
                              )}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                item.acceptedRoles.includes(user.role) && (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn(
                      "rounded-md",
                      pathname === item.url && "bg-sidebar-accent"
                    )}
                  >
                    <SidebarMenuButton asChild className="text-md">
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
