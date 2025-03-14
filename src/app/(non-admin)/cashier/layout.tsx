import { getUserAndValidateRoles } from "@/lib/auth";

export default async function CashierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const _ = await getUserAndValidateRoles({
    roles: ["ROOT", "ADMIN", "CASHIER"],
    forceRedirect: true,
  });

  return children;
}
