import Link from "next/link";
import React from "react";
import { ModeToggle } from "./theme-toggle";

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {year} CodingGigs. All rights reserved.
          </p>
          <ModeToggle />
        </div>
      </div>
    </footer>
  );
};
