"use client";

import { useUser } from "@clerk/nextjs";

export function useUserInfo() {
  const { user } = useUser();

  if (!user) return null;

  return {
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    email: user.emailAddresses[0]?.emailAddress ?? "unknown",
    avatar: user.imageUrl,
    role: user.publicMetadata?.role ?? "MEMBER",
  };
}
