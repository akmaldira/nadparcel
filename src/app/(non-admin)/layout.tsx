import Container from "@/components/container";
import { ModeSwitcher } from "@/components/mode-switcher";
import { NavUser } from "@/components/nav-user";
import { Separator } from "@/components/ui/separator";
import { getUserAndValidateRoles } from "@/lib/auth";
import { INDEX_ROUTE } from "@/lib/const";
import Image from "next/image";
import Link from "next/link";

export default async function NonAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserAndValidateRoles({
    roles: ["ROOT", "ADMIN", "CASHIER", "WORKER"],
    forceRedirect: true,
  });

  return (
    <div>
      <header className="bg-background fixed inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
        <Container className="flex h-16 w-full items-center justify-between gap-2">
          <Link href={INDEX_ROUTE} className="flex items-center gap-2">
            <Image
              src={"/nadparcel-light.png"}
              alt="Nadparcel Logo"
              width={100}
              height={58}
              className="dark:hidden"
            />
            <Image
              src={"/nadparcel-dark.png"}
              alt="Nadparcel Logo"
              width={100}
              height={58}
              className="hidden dark:block"
            />
          </Link>
          <div className="flex items-center gap-2">
            <NavUser user={user} side="bottom" className="w-40 md:w-auto" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 hidden md:flex"
            />
            <ModeSwitcher className="hidden md:flex" />
          </div>
        </Container>
      </header>
      <Container className="pt-24">{children}</Container>
    </div>
  );
}
