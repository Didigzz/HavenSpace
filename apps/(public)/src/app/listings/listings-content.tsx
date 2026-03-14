"use client";

import { ListingCard } from "@/components/listings";
import { getListings } from "@/lib/mock-data";
import { Button } from "@havenspace/ui";
import { MapPin, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ListingsContentProps {
  query?: string;
  location?: string;
  priceMin?: string;
  priceMax?: string;
  amenities?: string[];
  sort?: string;
}

export function ListingsContent({
  query,
  location,
  priceMin,
  priceMax,
  amenities,
  sort,
}: ListingsContentProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  const listings = getListings({
    query,
    location,
    priceMin,
    priceMax,
    amenities,
  });

  // Sort listings
  const sortedListings = [...listings].sort((a, b) => {
    switch (sort) {
      case "price-low":
        return a.priceMin - b.priceMin;
      case "price-high":
        return b.priceMax - a.priceMax;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime();
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Results Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{sortedListings.length}</span>{" "}
          results
          {query && (
            <span>
              {" "}
              for "<span className="font-medium">{query}</span>"
            </span>
          )}
          {location && (
            <span>
              {" "}
              in "<span className="font-medium">{location}</span>"
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/map">
            <Button variant="outline" size="sm" className="gap-2">
              <MapPin className="h-4 w-4" />
              Map View
            </Button>
          </Link>
          <div className="flex border rounded-md">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Listings */}
      {sortedListings.length > 0 ? (
        <div
          className={
            view === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          }
        >
          {sortedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No listings found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search filters or browse all listings
          </p>
          <Link href="/listings" className="mt-4">
            <Button>View All Listings</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
