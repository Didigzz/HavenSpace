"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Label } from "@havenspace/ui";
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react";

const AMENITIES = [
  "WiFi",
  "Parking",
  "Kitchen",
  "Bathroom",
  "Air Conditioning",
  "Laundry",
  "Security",
  "Furnished",
];

interface SearchFiltersProps {
  onSearch?: (filters: SearchFiltersState) => void;
  compact?: boolean;
}

export interface SearchFiltersState {
  query: string;
  location: string;
  priceMin: string;
  priceMax: string;
  amenities: string[];
}

export function SearchFilters({ onSearch, compact = false }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const [filters, setFilters] = useState<SearchFiltersState>({
    query: searchParams.get("q") || "",
    location: searchParams.get("location") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.location) params.set("location", filters.location);
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.amenities.length > 0) {
      params.set("amenities", filters.amenities.join(","));
    }

    if (onSearch) {
      onSearch(filters);
    } else {
      router.push(`/listings?${params.toString()}`);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      location: "",
      priceMin: "",
      priceMax: "",
      amenities: [],
    });
  };

  const hasActiveFilters =
    filters.query ||
    filters.location ||
    filters.priceMin ||
    filters.priceMax ||
    filters.amenities.length > 0;

  if (compact) {
    return (
      <div className="flex w-full max-w-3xl items-center gap-2 rounded-full border bg-background p-2 shadow-lg">
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search boarding houses..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="hidden h-8 w-px bg-border sm:block" />
        <div className="hidden flex-1 items-center gap-2 px-3 sm:flex">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Location"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} className="rounded-full" size="sm">
          <Search className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search boarding houses..."
            className="pl-10"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Location"
            className="pl-10"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {filters.amenities.length +
                  (filters.priceMin ? 1 : 0) +
                  (filters.priceMax ? 1 : 0)}
              </span>
            )}
          </Button>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="rounded-lg border bg-card p-4 space-y-4">
          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range (per month)</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) =>
                    setFilters({ ...filters, priceMin: e.target.value })
                  }
                />
              </div>
              <span className="text-muted-foreground">to</span>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) =>
                    setFilters({ ...filters, priceMax: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((amenity) => (
                <Button
                  key={amenity}
                  variant={filters.amenities.includes(amenity) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
