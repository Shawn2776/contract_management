export function isAdminUser(user) {
  const role = user?.publicMetadata?.role;
  return role === "OWNER" || role === "SUPER_ADMIN";
}
