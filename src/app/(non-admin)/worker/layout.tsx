import { getUserAndValidateRoles } from "@/lib/auth";

export default async function WorkerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const _user = await getUserAndValidateRoles({
    roles: ["ROOT", "ADMIN", "WORKER"],
    forceRedirect: true,
  });
  return children;
}
