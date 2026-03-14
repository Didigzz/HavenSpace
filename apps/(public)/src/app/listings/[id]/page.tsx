import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button, Badge } from "@havenspace/ui";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Users,
  Wifi,
  Car,
  Utensils,
  Bath,
  Wind,
  Shield,
  Dumbbell,
  Bed,
  ChevronLeft,
  Share2,
  Heart,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { getListingById, getRecentListings } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { ImageGallery } from "./image-gallery";
import { ContactCard } from "./contact-card";
import { ListingCard } from "@/components/listings";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-5 w-5" />,
  parking: <Car className="h-5 w-5" />,
  kitchen: <Utensils className="h-5 w-5" />,
  bathroom: <Bath className="h-5 w-5" />,
  "air conditioning": <Wind className="h-5 w-5" />,
  security: <Shield className="h-5 w-5" />,
  gym: <Dumbbell className="h-5 w-5" />,
  furnished: <Bed className="h-5 w-5" />,
  laundry: <Wind className="h-5 w-5" />,
  "study area": <Bed className="h-5 w-5" />,
};

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    notFound();
  }

  const similarListings = getRecentListings()
    .filter((l) => l.id !== listing.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="border-b">
        <div className="container py-4">
          <Link
            href="/listings"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to listings
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <ImageGallery images={listing.images} name={listing.name} />

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{listing.name}</h1>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {listing.address}, {listing.city}, {listing.province}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Rating & Availability */}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {listing.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{listing.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({listing.reviewCount} reviews)
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <span>{listing.totalRooms} total rooms</span>
                </div>
                {listing.availableRooms > 0 ? (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    {listing.availableRooms} rooms available
                  </Badge>
                ) : (
                  <Badge variant="secondary">Fully Occupied</Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold">Price Range</h2>
              <div className="mt-2">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(listing.priceMin)}
                </span>
                {listing.priceMax > listing.priceMin && (
                  <span className="text-2xl text-muted-foreground">
                    {" "}
                    - {formatCurrency(listing.priceMax)}
                  </span>
                )}
                <span className="text-muted-foreground"> / month</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Prices may vary depending on room type and size
              </p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold">About this place</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold">Amenities</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {listing.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="text-primary">
                      {amenityIcons[amenity.toLowerCase()] || (
                        <Star className="h-5 w-5" />
                      )}
                    </div>
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div>
              <h2 className="text-xl font-semibold">Location</h2>
              <div className="mt-4 aspect-[2/1] rounded-lg border bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Map will be displayed here</p>
                  <p className="text-sm">
                    {listing.address}, {listing.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Card */}
          <div className="lg:col-span-1">
            <ContactCard listing={listing} />
          </div>
        </div>

        {/* Similar Listings */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold">Similar Listings</h2>
          <p className="mt-2 text-muted-foreground">
            Other boarding houses you might be interested in
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
