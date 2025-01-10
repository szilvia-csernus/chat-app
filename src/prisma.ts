// this code makes sure that the prisma client is instantiated only once
// and that it is reused across hot reloads
// code source: https://authjs.dev/getting-started/adapters/prisma

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
