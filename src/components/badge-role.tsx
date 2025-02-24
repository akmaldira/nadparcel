import { Badge } from "@/components/ui/badge";
import { ID_USER_ROLE } from "@/lib/const";
import { $Enums } from "@prisma/client";

export default function BadgeRole({ role }: { role: $Enums.UserRole }) {
  const roleToVariant = {
    ROOT: "destructive",
    ADMIN: "primary",
    CASHIER: "blue",
    WORKER: "green",
    USER: "yellow",
  } as Record<
    $Enums.UserRole,
    "primary" | "blue" | "destructive" | "green" | "yellow"
  >;
  return <Badge variant={roleToVariant[role]}>{ID_USER_ROLE[role]}</Badge>;
}
