"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Home,
  Bookmark,
  BookmarkX,
  MapPin,
  Star,
  Heart,
  Eye,
  Filter,
  Grid,
  List,
  Wifi,
  Car,
  UtensilsCrossed,
  Wind,
  Droplets,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@havenspace/shared/ui";
import { formatCurrency } from "@/lib/utils";

// Mock saved listings data
const mockSavedListings = [
  {
    id: "1",
    name: "University Residence",
    description:
      "Modern dormitory near major universities with complete amenities.",
    location: "España, Manila",
    price: 4500,
    rating: 4.8,
    reviews: 24,
    image: "/images/listing-1.jpg",
    savedAt: "2025-01-10",
    type: "Dormitory",
    amenities: ["wifi", "aircon", "laundry", "kitchen"],
    available: true,
  },
  {
    id: "2",
    name: "Metro Boarding House",
    description:
      "Spacious rooms with private bathroom in prime Cubao location.",
    location: "Cubao, Quezon City",
    price: 5000,
    rating: 4.5,
    reviews: 18,
    image: "/images/listing-2.jpg",
    savedAt: "2025-01-08",
    type: "Boarding House",
    amenities: ["wifi", "parking", "kitchen"],
    available: true,
  },
  {
    id: "3",
    name: "Cozy Student Dorm",
    description: "Affordable student accommodation with study areas.",
    location: "Taft Ave, Manila",
    price: 5500,
    rating: 4.7,
    reviews: 32,
    image: "/images/listing-3.jpg",
    savedAt: "2025-01-05",
    type: "Dormitory",
    amenities: ["wifi", "aircon", "water"],
    available: false,
  },
  {
    id: "4",
    name: "Green Valley Residence",
    description: "Peaceful living environment with garden views.",
    location: "Diliman, Quezon City",
    price: 6500,
    rating: 4.9,
    reviews: 45,
    image: "/images/listing-4.jpg",
    savedAt: "2025-01-03",
    type: "Apartment",
    amenities: ["wifi", "parking", "aircon", "kitchen", "water"],
    available: true,
  },
  {
    id: "5",
    name: "City Center Dorm",
    description: "Prime location with easy access to public transportation.",
    location: "Makati City",
    price: 7000,
    rating: 4.6,
    reviews: 28,
    image: "/images/listing-5.jpg",
    savedAt: "2024-12-28",
    type: "Dormitory",
    amenities: ["wifi", "aircon", "laundry"],
    available: true,
  },
  {
    id: "6",
    name: "Sunrise Apartments",
    description: "Fully furnished units with modern amenities.",
    location: "Pasig City",
    price: 8500,
    rating: 4.8,
    reviews: 52,
    image: "/images/listing-6.jpg",
    savedAt: "2024-12-25",
    type: "Apartment",
    amenities: ["wifi", "parking", "aircon", "kitchen", "water", "laundry"],
    available: true,
  },
];

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  parking: <Car className="h-4 w-4" />,
  kitchen: <UtensilsCrossed className="h-4 w-4" />,
  aircon: <Wind className="h-4 w-4" />,
  water: <Droplets className="h-4 w-4" />,
  laundry: <Wind className="h-4 w-4" />,
};

export default function SavedListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedListings, setSavedListings] = useState(mockSavedListings);

  const filteredListings = savedListings
    .filter((listing) => {
      const matchesSearch =
        listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "all" ||
        listing.type.toLowerCase().replace(" ", "-") === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "recent":
        default:
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      }
    });

  const handleRemoveSaved = (id: string) => {
    setSavedListings((prev) => prev.filter((listing) => listing.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Saved Listings
          </h1>
          <p className="text-muted-foreground">
            {savedListings.length} properties saved
          </p>
        </div>
        <Button asChild>
          <Link href="/browse">
            <Search className="mr-2 h-4 w-4" />
            Browse More
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search saved listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="dormitory">Dormitory</SelectItem>
                  <SelectItem value="boarding-house">Boarding House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Saved</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
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
        </CardContent>
      </Card>

      {/* Listings */}
      {filteredListings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bookmark className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="text-lg font-semibold">No saved listings found</h3>
            <p className="text-muted-foreground mt-2 text-center">
              {searchQuery || filterType !== "all"
                ? "Try adjusting your filters or search query."
                : "Start browsing and save properties you're interested in."}
            </p>
            <Button className="mt-4" asChild>
              <Link href="/browse">Browse Listings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="group overflow-hidden">
              <div className="bg-muted relative h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home className="text-muted-foreground h-12 w-12" />
                </div>
                {!listing.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Badge variant="secondary" className="text-sm">
                      Not Available
                    </Badge>
                  </div>
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemoveSaved(listing.id)}
                >
                  <BookmarkX className="h-4 w-4" />
                </Button>
                <Badge className="absolute top-2 left-2">{listing.type}</Badge>
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
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{listing.rating}</span>
                    <span className="text-muted-foreground">
                      ({listing.reviews})
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                  {listing.description}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {listing.amenities.slice(0, 4).map((amenity) => (
                    <div
                      key={amenity}
                      className="bg-muted text-muted-foreground rounded-md p-1.5"
                      title={amenity}
                    >
                      {amenityIcons[amenity]}
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/browse/${listing.id}`}>
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" disabled={!listing.available} asChild>
                      <Link href={`/browse/${listing.id}?book=true`}>Book</Link>
                    </Button>
                  </div>
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
                  <Badge className="absolute top-2 left-2">
                    {listing.type}
                  </Badge>
                </div>
                <CardContent className="flex-1 p-4">
                  <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {listing.name}
                        </h3>
                        <p className="text-muted-foreground flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {listing.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{listing.rating}</span>
                        <span className="text-muted-foreground text-sm">
                          ({listing.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-2 flex-1">
                      {listing.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      {listing.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="bg-muted text-muted-foreground rounded-md p-1.5"
                          title={amenity}
                        >
                          {amenityIcons[amenity]}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSaved(listing.id)}
                        >
                          <BookmarkX className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
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
