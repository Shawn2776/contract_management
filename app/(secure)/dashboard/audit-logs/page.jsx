import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { notFound } from "next/navigation";

export default async function AuditLogsPage({ searchParams }) {
  const clerkUser = await currentUser();
  if (!clerkUser) return notFound();

  const appUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: { memberships: true },
  });

  const role = appUser.role;
  const tenantId = appUser.memberships[0]?.tenantId;

  // SUPER_ADMIN can filter by tenant or user
  const filterTenantId =
    searchParams.tenantId === "__all__" ? null : searchParams.tenantId;
  const filterUserId =
    searchParams.userId === "__all__" ? null : searchParams.userId;

  const where =
    role === "SUPER_ADMIN"
      ? {
          ...(filterUserId ? { userId: filterUserId } : {}),
          ...(filterTenantId
            ? {
                user: {
                  memberships: {
                    some: {
                      tenantId: filterTenantId,
                    },
                  },
                },
              }
            : {}),
        }
      : role === "OWNER"
      ? {
          user: {
            memberships: {
              some: {
                tenantId,
              },
            },
          },
        }
      : { userId: appUser.id };

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: true },
  });

  const allUsers =
    role === "SUPER_ADMIN"
      ? await prisma.user.findMany({ select: { id: true, name: true } })
      : [];
  const allTenants =
    role === "SUPER_ADMIN"
      ? await prisma.tenant.findMany({ select: { id: true, name: true } })
      : [];

  return (
    <div className="w-full mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          {role === "SUPER_ADMIN" && (
            <form method="get" className="flex gap-4 mt-4">
              <Select
                name="tenantId"
                defaultValue={filterTenantId || "__all__"}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tenant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All tenants</SelectItem>
                  {allTenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select name="userId" defaultValue={filterUserId || "__all__"}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All users</SelectItem>
                  {allUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name || u.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80"
              >
                Apply
              </button>
            </form>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">
              No logs found for your current role and filters.
            </p>
          ) : (
            <ul className="divide-y">
              {logs.map((log) => (
                <li key={log.id} className="py-3 space-y-1">
                  <div className="text-sm leading-tight">
                    <strong>{log.user.name || "Unknown user"}</strong> performed{" "}
                    <strong className="uppercase text-primary">
                      {log.action}
                    </strong>{" "}
                    on <strong>{log.table}</strong>{" "}
                    {log.recordId && (
                      <>
                        (
                        <Link
                          href={`/dashboard/${log.table.toLowerCase()}s/${
                            log.recordId
                          }`}
                          className="underline text-blue-500 text-xs"
                        >
                          {log.recordId}
                        </Link>
                        )
                      </>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                  {log.data && (
                    <pre className="text-xs mt-1 bg-muted p-2 rounded whitespace-pre-wrap">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
