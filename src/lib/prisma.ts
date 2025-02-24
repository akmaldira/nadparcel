import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { createSoftDeleteMiddleware } from "prisma-soft-delete-middleware";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton>;
};

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
    ],
  });
  return client;
};

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

prisma.$use(
  createSoftDeleteMiddleware({
    models: {
      Item: true,
      ItemHistory: true,
      Parcel: true,
      ParcelToItem: true,
    },
    defaultConfig: {
      field: "deletedAt",
      createValue: (deleted) => {
        if (deleted) return new Date();
        return null;
      },
    },
  })
);

const logFile = path.join(path.resolve(process.cwd()), "query.log");
const storeQueryPrefix = ["INSERT", "UPDATE", "DELETE"];
prisma.$on("query", async (e) => {
  if (storeQueryPrefix.some((prefix) => e.query.startsWith(prefix))) {
    if (!fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, "");
    }

    const newLine = JSON.stringify(e);
    fs.appendFileSync(logFile, `${newLine}\n`);
  }
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
