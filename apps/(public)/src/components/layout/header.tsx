"use client";

import Link from "next/link";
import { Button } from "@havenspace/ui";
import { Home, Menu, X, User, MapPin } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">BoardingHouse</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/listings"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Browse Listings
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
          >
            <MapPin className="h-4 w-4" />
            Map View
          </Link>
          <Link
            href="/become-landlord"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Become a Landlord
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center space-x-4 md:flex">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Sign up</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container flex flex-col space-y-4 py-4">
            <Link
              href="/listings"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Listings
            </Link>
            <Link
              href="/map"
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="h-4 w-4" />
              Map View
            </Link>
            <Link
              href="/become-landlord"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Become a Landlord
            </Link>
            <div className="flex items-center space-x-4 pt-4 border-t">
              <ThemeToggle />
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full" size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
