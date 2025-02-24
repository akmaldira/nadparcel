import { prisma } from "@/lib/prisma";
import UserTable from "./table";

export default async function AdminUserPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return (
    <div>
      <UserTable users={users} />
    </div>
  );
}
