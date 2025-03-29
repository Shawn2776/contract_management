// lib/prisma/withAudit.js
// import prisma from "../prisma";
// import { auditLogMiddleware } from "./middleware/auditLogMiddleware";

import { auditLogMiddleware } from "@/prisma/middleware/auditLogMiddleware";
import prisma from "../prisma";

export function prismaWithUser(userId) {
  // Clone the base instance
  const client = new prisma.constructor();

  // Attach audit middleware
  client.$use(auditLogMiddleware(userId));

  return client;
}
