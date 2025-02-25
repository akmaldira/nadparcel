import { cookies } from "next/headers";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeSwitcher } from "@/components/mode-switcher";
import { NavUser } from "@/components/nav-user";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUserAndValidateRoles } from "@/lib/auth";
import { INDEX_ROUTE } from "@/lib/const";
import Image from "next/image";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserAndValidateRoles({
    roles: ["ROOT", "ADMIN"],
    forceRedirect: true,
  });

  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state");
  const defaultOpen = sidebarState ? sidebarState.value === "true" : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="flex flex-col">
      <header className="bg-background fixed inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
        <div className="flex h-16 w-full items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1.5" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Link href={INDEX_ROUTE}>
              <Image
                src={"/nadparcel-light.png"}
                alt="Nadparcel Logo"
                width={100}
                height={100}
                className="dark:hidden"
              />
              <Image
                src={"/nadparcel-dark.png"}
                alt="Nadparcel Logo"
                width={100}
                height={100}
                className="hidden dark:block"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <NavUser user={user} side="bottom" className="w-40 md:w-auto" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 hidden md:flex"
            />
            <ModeSwitcher className="hidden md:flex" />
          </div>
        </div>
      </header>
      <div className="flex flex-1 h-fit">
        <AppSidebar
          className="mt-16 border-t h-[calc(100svh-64px)]"
          user={user}
        />
        <SidebarInset className="pt-24 container">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
