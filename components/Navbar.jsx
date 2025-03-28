import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { ModeToggle } from "./theme/ModeToggle";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-primary text-primary-foreground">
      <div>Logo</div>
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
      </div>
    </nav>
  );
};

export default Navbar;
