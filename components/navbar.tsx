"use client";

import { Code, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { AuthButton } from "./auth-button";

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Code className="h-6 w-6" />
          <h1 className="font-bold text-xl">CodingGigs</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/how-it-works" className="font-medium text-sm">
            How it Works
          </Link>
          <Link href="/browse-gigs" className="font-medium text-sm">
            Browse Gigs
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/post">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Post a Gig
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button>Sign In to Post</Button>
              </Link>
            )}
            <AuthButton />
          </div>
        </nav>
      </div>
    </header>
  );
};
