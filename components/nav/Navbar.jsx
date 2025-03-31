"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { ModeToggle } from "../theme/ModeToggle";

const Navbar = () => {
  const { user, isLoaded } = useUser();
  const [tenant, setTenant] = useState(null);

  const pathname = usePathname();

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "";
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  useEffect(() => {
    fetch("/api/tenant")
      .then((res) => res.json())
      .then(setTenant);
  }, []);

  const pathTitle = getPageTitle();

  return (
    <nav className="flex justify-between p-2 items-center bg-primary text-primary-foreground">
      {/* <h1 className="text-xl font-bold">
        Welcome, {user?.firstName || "User"}!
      </h1>
      {tenant && (
        <p className="text-sm text-primary-foreground/50">
          Managing <strong>{tenant.name}</strong>
        </p>
      )} */}
      <div>&nbsp;</div>

      {/* <div className="hidden md:flex text-4xl font-bold">{pathTitle}</div> */}
      <div>
        <div className="flex gap-2 pr-5">
          {user?.publicMetadata?.role === "OWNER" ||
            ("SUPER_ADMIN" && (
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>Owner Tools</MenubarTrigger>
                  <MenubarContent>
                    {/* You can add links to manage users, billing, etc. */}
                    <MenubarItem>Invite team members</MenubarItem>
                    <MenubarItem>Manage subscriptions</MenubarItem>
                    <MenubarItem>See audit logs</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Pages</MenubarTrigger>
                  <MenubarContent>
                    {/* You can add links to manage users, billing, etc. */}
                    <MenubarItem>
                      <Link href="/dashboard">Home</Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link href="/dashboard/invoices">Invoices</Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link href="/dashboard/products">Products</Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link href="/dashboard/customers">Customers</Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            ))}
          <ModeToggle />
          <SignedOut className="flex items-center">
            <SignInButton className="hover:cursor-pointer hover:underline" />
            <span className="flex items-center">/</span>
            <SignUpButton className="hover:cursor-pointer hover:underline" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

{
  /* <div>Logo</div>
      <div className="flex gap-1">
        <ModeToggle />
        <SignedOut className="flex items-center">
          <SignInButton className="hover:cursor-pointer hover:underline" />
          <span className="flex items-center">/</span>
          <SignUpButton className="hover:cursor-pointer hover:underline" />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div> */
}
