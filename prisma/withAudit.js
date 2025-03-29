import prisma from "@/lib/prisma";
import { auditLogMiddleware } from "./middleware/auditLogMiddleware";

export function prismaWithUser(userId) {
  const instance = prisma.$extends({});
  instance.$use(auditLogMiddleware(userId));
  return instance;
}
