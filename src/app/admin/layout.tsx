import { cookies } from "next/headers";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeSwitcher } from "@/components/mode-switcher";
import { NavHeader } from "@/components/nav-header";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUserAndValidateRoles } from "@/lib/auth";

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
        <div className="flex h-14 w-full items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1.5" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <NavHeader user={user} />
          <div className="ml-auto flex items-center gap-2">
            <ModeSwitcher />
          </div>
        </div>
      </header>
      <div className="flex flex-1 h-fit">
        <AppSidebar className="mt-14 h-[calc(100svh-56px)]" user={user} />
        <SidebarInset className="pt-20 container">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
