import { auth } from "@/lib/auth";
import { nextRouteByRole } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const session = await auth();

  if (session && session.user) {
    const nextRoute = nextRouteByRole(session.user.role);
    redirect(nextRoute);
  }

  return children;
}
