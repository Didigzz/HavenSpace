"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Home,
  MapPin,
  Star,
  Filter,
  Grid,
  List,
  Heart,
  Eye,
  Wifi,
  Car,
  UtensilsCrossed,
  Wind,
  Droplets,
  Users,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import { Button } from "@havenspace/shared/ui";
import { Input } from "@havenspace/shared/ui";
import { Badge } from "@havenspace/shared/ui";
import { Label } from "@havenspace/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@havenspace/shared/ui";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@havenspace/shared/ui";
import { Separator } from "@havenspace/shared/ui";
import { formatCurrency } from "@/lib/utils";

// Mock listings data
const mockListings = [
  {
    id: "1",
    name: "Sunrise Dormitory",
    description:
      "Modern dormitory with complete amenities near universities. Quiet study environment.",
    location: "Sampaloc, Manila",
    price: 5500,
    rating: 4.8,
    reviews: 45,
    type: "Dormitory",
    amenities: ["wifi", "aircon", "laundry", "kitchen", "water"],
    capacity: 1,
    available: true,
    featured: true,
    image: "/images/listing-1.jpg",
  },
  {
    id: "2",
    name: "Green Valley Boarding House",
    description:
      "Spacious rooms with private bathroom. Garden views and peaceful environment.",
    location: "Diliman, Quezon City",
    price: 6500,
    rating: 4.9,
    reviews: 62,
    type: "Boarding House",
    amenities: ["wifi", "parking", "kitchen", "water"],
    capacity: 2,
    available: true,
    featured: true,
    image: "/images/listing-2.jpg",
  },
  {
    id: "3",
    name: "Metro Residences",
    description:
      "Prime location with easy access to MRT. Modern facilities and 24/7 security.",
    location: "Cubao, Quezon City",
    price: 5000,
    rating: 4.5,
    reviews: 38,
    type: "Apartment",
    amenities: ["wifi", "aircon", "parking"],
    capacity: 1,
    available: true,
    featured: false,
    image: "/images/listing-3.jpg",
  },
  {
    id: "4",
    name: "University Residence",
    description:
      "Budget-friendly option for students. Walking distance to major universities.",
    location: "España, Manila",
    price: 4500,
    rating: 4.7,
    reviews: 89,
    type: "Dormitory",
    amenities: ["wifi", "water", "laundry"],
    capacity: 2,
    available: true,
    featured: false,
    image: "/images/listing-4.jpg",
  },
  {
    id: "5",
    name: "City Center Dorm",
    description:
      "Newly renovated rooms in the heart of Makati. Perfect for young professionals.",
    location: "Makati City",
    price: 7000,
    rating: 4.6,
    reviews: 52,
    type: "Dormitory",
    amenities: ["wifi", "aircon", "kitchen", "laundry", "water"],
    capacity: 1,
    available: false,
    featured: true,
    image: "/images/listing-5.jpg",
  },
  {
    id: "6",
    name: "Cozy Student Haven",
    description:
      "Affordable accommodation with study areas. Great community atmosphere.",
    location: "Taft Ave, Manila",
    price: 4000,
    rating: 4.4,
    reviews: 34,
    type: "Boarding House",
    amenities: ["wifi", "water"],
    capacity: 2,
    available: true,
    featured: false,
    image: "/images/listing-6.jpg",
  },
  {
    id: "7",
    name: "Premium Suites",
    description:
      "Luxury furnished units with premium amenities. Gym and pool access included.",
    location: "BGC, Taguig",
    price: 12000,
    rating: 4.9,
    reviews: 28,
    type: "Apartment",
    amenities: ["wifi", "aircon", "parking", "kitchen", "water", "laundry"],
    capacity: 1,
    available: true,
    featured: true,
    image: "/images/listing-7.jpg",
  },
  {
    id: "8",
    name: "Budget Dorm",
    description:
      "No-frills accommodation for budget-conscious boarders. Basic but clean.",
    location: "Pasay City",
    price: 3500,
    rating: 4.2,
    reviews: 67,
    type: "Dormitory",
    amenities: ["wifi", "water"],
    capacity: 4,
    available: true,
    featured: false,
    image: "/images/listing-8.jpg",
  },
];

const amenityIcons: Record<string, { icon: React.ReactNode; label: string }> = {
  wifi: { icon: <Wifi className="h-4 w-4" />, label: "WiFi" },
  parking: { icon: <Car className="h-4 w-4" />, label: "Parking" },
  kitchen: { icon: <UtensilsCrossed className="h-4 w-4" />, label: "Kitchen" },
  aircon: { icon: <Wind className="h-4 w-4" />, label: "Air Conditioning" },
  water: { icon: <Droplets className="h-4 w-4" />, label: "Water" },
  laundry: { icon: <Wind className="h-4 w-4" />, label: "Laundry" },
};

const locations = [
  "All Locations",
  "Manila",
  "Quezon City",
  "Makati City",
  "Taguig",
  "Pasay City",
  "Pasig City",
];

const propertyTypes = ["All Types", "Dormitory", "Boarding House", "Apartment"];

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recommended");
  const [filters, setFilters] = useState({
    location: "All Locations",
    type: "All Types",
    minPrice: "",
    maxPrice: "",
    amenities: [] as string[],
    availableOnly: true,
  });
  const [savedListings, setSavedListings] = useState<string[]>(["1", "4"]);

  const filteredListings = mockListings
    .filter((listing) => {
      const matchesSearch =
        listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        filters.location === "All Locations" ||
        listing.location.includes(filters.location);

      const matchesType =
        filters.type === "All Types" || listing.type === filters.type;

      const matchesMinPrice =
        !filters.minPrice || listing.price >= parseInt(filters.minPrice);

      const matchesMaxPrice =
        !filters.maxPrice || listing.price <= parseInt(filters.maxPrice);

      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((a) => listing.amenities.includes(a));

      const matchesAvailability = !filters.availableOnly || listing.available;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesAmenities &&
        matchesAvailability
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
        default:
          return b.featured ? 1 : -1;
      }
    });

  const toggleSaved = (id: string) => {
    setSavedListings((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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
      location: "All Locations",
      type: "All Types",
      minPrice: "",
      maxPrice: "",
      amenities: [],
      availableOnly: true,
    });
  };

  const activeFiltersCount = [
    filters.location !== "All Locations",
    filters.type !== "All Types",
    filters.minPrice,
    filters.maxPrice,
    filters.amenities.length > 0,
    !filters.availableOnly,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Browse Listings
        </h1>
        <p className="text-muted-foreground">
          Find your perfect boarding house or dormitory.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-xl flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={filters.location}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, location: v }))
                }
              >
                <SelectTrigger className="w-[160px]">
                  <MapPin className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.type}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, type: v }))
                }
              >
                <SelectTrigger className="w-[150px]">
                  <Home className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>

              {/* Advanced Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine your search with additional filters.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Price Range */}
                    <div className="space-y-2">
                      <Label>Price Range (per month)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              minPrice: e.target.value,
                            }))
                          }
                        />
                        <span className="flex items-center">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              maxPrice: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Amenities */}
                    <div className="space-y-2">
                      <Label>Amenities</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(amenityIcons).map(
                          ([key, { icon, label }]) => (
                            <Button
                              key={key}
                              variant={
                                filters.amenities.includes(key)
                                  ? "secondary"
                                  : "outline"
                              }
                              size="sm"
                              className="justify-start"
                              onClick={() => toggleAmenity(key)}
                            >
                              {icon}
                              <span className="ml-2">{label}</span>
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Availability */}
                    <div className="flex items-center justify-between">
                      <Label>Show available only</Label>
                      <Button
                        variant={
                          filters.availableOnly ? "secondary" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            availableOnly: !prev.availableOnly,
                          }))
                        }
                      >
                        {filters.availableOnly ? "Yes" : "No"}
                      </Button>
                    </div>

                    <Separator />

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
              <span className="text-muted-foreground text-sm">
                Active filters:
              </span>
              {filters.location !== "All Locations" && (
                <Badge variant="secondary" className="gap-1">
                  {filters.location}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        location: "All Locations",
                      }))
                    }
                  />
                </Badge>
              )}
              {filters.type !== "All Types" && (
                <Badge variant="secondary" className="gap-1">
                  {filters.type}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, type: "All Types" }))
                    }
                  />
                </Badge>
              )}
              {filters.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="gap-1">
                  {amenityIcons[amenity]?.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleAmenity(amenity)}
                  />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {filteredListings.length} listings found
        </p>
      </div>

      {/* Listings */}
      {filteredListings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="text-lg font-semibold">No listings found</h3>
            <p className="text-muted-foreground mt-2 text-center">
              Try adjusting your filters or search query.
            </p>
            <Button className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="group overflow-hidden">
              <div className="bg-muted relative h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home className="text-muted-foreground h-12 w-12" />
                </div>
                {!listing.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Badge variant="secondary">Not Available</Badge>
                  </div>
                )}
                {listing.featured && listing.available && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500">
                    Featured
                  </Badge>
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => toggleSaved(listing.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      savedListings.includes(listing.id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{listing.name}</h3>
                    <p className="text-muted-foreground flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{listing.location}</span>
                    </p>
                  </div>
                  <Badge variant="outline">{listing.type}</Badge>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{listing.rating}</span>
                  <span className="text-muted-foreground">
                    ({listing.reviews} reviews)
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {listing.amenities.slice(0, 4).map((amenity) => (
                    <div
                      key={amenity}
                      className="bg-muted text-muted-foreground rounded-md p-1.5"
                      title={amenityIcons[amenity]?.label}
                    >
                      {amenityIcons[amenity]?.icon}
                    </div>
                  ))}
                  {listing.amenities.length > 4 && (
                    <span className="text-muted-foreground text-xs">
                      +{listing.amenities.length - 4}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div>
                    <span className="text-lg font-bold">
                      {formatCurrency(listing.price)}
                    </span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                  </div>
                  <Button size="sm" disabled={!listing.available} asChild>
                    <Link href={`/browse/${listing.id}`}>
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-muted relative h-48 flex-shrink-0 md:h-auto md:w-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="text-muted-foreground h-12 w-12" />
                  </div>
                  {!listing.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Badge variant="secondary">Not Available</Badge>
                    </div>
                  )}
                  {listing.featured && listing.available && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {listing.name}
                        </h3>
                        <Badge variant="outline">{listing.type}</Badge>
                      </div>
                      <p className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {listing.location}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaved(listing.id)}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          savedListings.includes(listing.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <p className="text-muted-foreground mt-2 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{listing.rating}</span>
                      <span className="text-muted-foreground text-sm">
                        ({listing.reviews} reviews)
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4" />
                      {listing.capacity}{" "}
                      {listing.capacity > 1 ? "persons" : "person"}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {listing.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="bg-muted text-muted-foreground rounded-md p-1.5"
                        title={amenityIcons[amenity]?.label}
                      >
                        {amenityIcons[amenity]?.icon}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div>
                      <span className="text-xl font-bold">
                        {formatCurrency(listing.price)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/browse/${listing.id}`}>
                          <Eye className="mr-1 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm" disabled={!listing.available} asChild>
                        <Link href={`/browse/${listing.id}?book=true`}>
                          Book Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
