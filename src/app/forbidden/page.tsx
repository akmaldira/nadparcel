import Container from "@/components/container";
import { auth } from "@/lib/auth";
import { nextRouteByRole } from "@/lib/utils";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ForbiddenPage() {
  let backUrl = "/login";

  const session = await auth();
  const user = session?.user;

  if (user) {
    backUrl = nextRouteByRole(user.role);
  } else {
    redirect(backUrl);
  }

  return (
    <Container className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="mx-auto max-w-md text-center">
        <XCircle className="mx-auto h-24 w-24 text-destructive" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-primary">
          403 Forbidden
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Maaf, anda tidak punya akses ke halaman tersebut!.
        </p>
        <Link
          href={backUrl}
          className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Kembali
        </Link>
      </div>
    </Container>
  );
}
