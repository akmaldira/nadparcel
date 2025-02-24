import { getUserAndValidateRoles } from "@/lib/auth";

export default async function AdminUserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const _user = await getUserAndValidateRoles({
    roles: ["ROOT"],
    forceRedirect: true,
  });
  return children;
}
