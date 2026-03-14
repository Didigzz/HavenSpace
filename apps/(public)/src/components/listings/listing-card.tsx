import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@havenspace/ui";
import { MapPin, Users, Wifi, Car, Utensils, Bath, Star } from "lucide-react";
import { Badge } from "@havenspace/ui";
import { BoardingHouse } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ListingCardProps {
  listing: BoardingHouse;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-3.5 w-3.5" />,
  parking: <Car className="h-3.5 w-3.5" />,
  kitchen: <Utensils className="h-3.5 w-3.5" />,
  bathroom: <Bath className="h-3.5 w-3.5" />,
};

export function ListingCard({ listing }: ListingCardProps) {
  const displayAmenities = listing.amenities.slice(0, 3);
  const remainingCount = listing.amenities.length - 3;

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={listing.images[0] || "/placeholder-house.jpg"}
            alt={listing.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {listing.availableRooms > 0 ? (
            <Badge className="absolute left-3 top-3 bg-green-500 hover:bg-green-600">
              {listing.availableRooms} room{listing.availableRooms > 1 ? "s" : ""} available
            </Badge>
          ) : (
            <Badge variant="secondary" className="absolute left-3 top-3">
              Fully Occupied
            </Badge>
          )}
          {listing.rating && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-sm font-medium">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {listing.rating.toFixed(1)}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title & Location */}
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {listing.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{listing.address}</span>
          </div>

          {/* Price */}
          <div className="mt-3">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(listing.priceMin)}
            </span>
            {listing.priceMax > listing.priceMin && (
              <span className="text-lg text-muted-foreground">
                {" "}
                - {formatCurrency(listing.priceMax)}
              </span>
            )}
            <span className="text-sm text-muted-foreground"> / month</span>
          </div>

          {/* Amenities */}
          <div className="mt-3 flex flex-wrap gap-2">
            {displayAmenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs"
              >
                {amenityIcons[amenity.toLowerCase()] || null}
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                +{remainingCount} more
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t px-4 py-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{listing.totalRooms} total rooms</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
