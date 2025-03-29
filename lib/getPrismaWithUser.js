import { auditLogMiddleware } from "@/prisma/middleware/auditLogMiddleware";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
// import { auditLogMiddleware } from "./prisma/middleware/auditLogMiddleware";

export async function getPrismaWithUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized – Clerk user not found");
  }

  const prisma = new PrismaClient(); // ✅ Fresh instance
  prisma.$use(auditLogMiddleware(user.id)); // ✅ Works here

  return { prisma, user };
}
