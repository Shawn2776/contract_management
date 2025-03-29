import prisma from "@/lib/prisma";

// export function auditLogMiddleware(userId) {
//   return async (params, next) => {
//     const result = await next(params);

//     const actionType = params.action.toUpperCase();
//     const model = params.model;
//     const recordId = result?.id?.toString?.();

//     const trackedActions = ["CREATE", "UPDATE", "DELETE"];

//     if (trackedActions.includes(actionType) && model && recordId && userId) {
//       try {
//         await prisma.auditLog.create({
//           data: {
//             action: actionType,
//             table: model,
//             recordId,
//             data: params.args?.data || null,
//             userId,
//           },
//         });
//       } catch (err) {
//         console.error("Audit log error:", err);
//       }
//     }

//     return result;
//   };
// }

export function auditLogMiddleware(userId) {
  return async (params, next) => {
    const result = await next(params);

    const actionType = params.action.toUpperCase();
    const model = params.model;
    const recordId = result?.id?.toString?.();

    const trackedActions = ["CREATE", "UPDATE", "DELETE"];

    // Avoid recursive logging
    if (model === "AuditLog") return result;

    if (trackedActions.includes(actionType) && model && recordId && userId) {
      try {
        await prisma.auditLog.create({
          data: {
            action: actionType,
            table: model,
            recordId,
            data: params.args?.data || null,
            userId,
          },
        });
      } catch (err) {
        console.error("Audit log error:", err);
      }
    }

    return result;
  };
}
