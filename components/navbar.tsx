"use client";

import Link from "next/link";
import { Package } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Package className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">ParcelFlow</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Features
            </Link>
            <Link href="/#faq" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              FAQ
            </Link>
            <Link href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/track"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Track Parcel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
