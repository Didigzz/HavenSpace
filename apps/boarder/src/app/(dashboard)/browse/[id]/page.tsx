"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Home,
  MapPin,
  Star,
  Heart,
  Share2,
  Calendar,
  Users,
  Wifi,
  Car,
  UtensilsCrossed,
  Wind,
  Droplets,
  Phone,
  Mail,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Check,
  Shield,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import { Button } from "@havenspace/shared/ui";
import { Badge } from "@havenspace/shared/ui";
import { Separator } from "@havenspace/shared/ui";
import { Input } from "@havenspace/shared/ui";
import { Label } from "@havenspace/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@havenspace/shared/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@havenspace/shared/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";

// Mock listing data
const mockListing = {
  id: "1",
  name: "Sunrise Dormitory",
  description: `Welcome to Sunrise Dormitory, your home away from home! Located in the heart of Sampaloc, Manila, we offer comfortable and affordable accommodation for students and young professionals.

Our dormitory features modern amenities including high-speed WiFi, air-conditioned rooms, a fully equipped shared kitchen, and laundry facilities. We prioritize your safety with 24/7 security, CCTV monitoring, and a strict visitor policy.

The location is perfect for students as it's walking distance to major universities including UST, FEU, and UE. Nearby you'll find convenience stores, restaurants, laundromats, and public transportation.`,
  location: "123 España Blvd, Sampaloc, Manila",
  city: "Manila",
  coordinates: { lat: 14.6091, lng: 120.989 },
  price: 5500,
  depositAmount: 11000,
  rating: 4.8,
  reviewCount: 45,
  type: "Dormitory",
  roomType: "Single Room",
  capacity: 1,
  size: "12 sqm",
  floor: "3rd Floor",
  available: true,
  availableFrom: "2025-02-01",
  minStay: "6 months",
  amenities: [
    { key: "wifi", label: "High-Speed WiFi", included: true },
    { key: "aircon", label: "Air Conditioning", included: true },
    { key: "water", label: "Water Bill", included: true },
    { key: "kitchen", label: "Shared Kitchen", included: true },
    { key: "laundry", label: "Laundry Area", included: true },
    { key: "parking", label: "Parking", included: false },
  ],
  houseRules: [
    "No smoking inside the building",
    "Visitors allowed until 9 PM only",
    "Quiet hours from 10 PM to 6 AM",
    "No pets allowed",
    "Payment due every 1st of the month",
  ],
  images: [
    "/images/room-1.jpg",
    "/images/room-2.jpg",
    "/images/room-3.jpg",
    "/images/room-4.jpg",
  ],
  landlord: {
    id: "L1",
    name: "John Santos",
    avatar: "/avatars/john.jpg",
    verified: true,
    responseRate: 98,
    responseTime: "within an hour",
    memberSince: "2020",
    properties: 5,
  },
};

const mockReviews = [
  {
    id: "R1",
    author: "Maria Garcia",
    avatar: "/avatars/maria.jpg",
    rating: 5,
    date: "2025-01-10",
    comment:
      "Great place to stay! Very clean and well-maintained. The landlord is very accommodating and responsive. Highly recommended for students!",
    stayDuration: "6 months",
  },
  {
    id: "R2",
    author: "Pedro Reyes",
    avatar: "/avatars/pedro.jpg",
    rating: 4,
    date: "2024-12-15",
    comment:
      "Good value for money. Location is excellent, very near to universities. WiFi is fast. Only wish there was better ventilation in common areas.",
    stayDuration: "1 year",
  },
  {
    id: "R3",
    author: "Ana Cruz",
    avatar: "/avatars/ana.jpg",
    rating: 5,
    date: "2024-11-20",
    comment:
      "I've been staying here for 2 years now. Best dorm in the area! The management keeps improving the facilities. Feels like home.",
    stayDuration: "2 years",
  },
];

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-5 w-5" />,
  parking: <Car className="h-5 w-5" />,
  kitchen: <UtensilsCrossed className="h-5 w-5" />,
  aircon: <Wind className="h-5 w-5" />,
  water: <Droplets className="h-5 w-5" />,
  laundry: <Wind className="h-5 w-5" />,
};

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const showBooking = searchParams.get("book") === "true";

  const [isSaved, setIsSaved] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(showBooking);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    duration: "6",
    message: "",
  });

  const listing = mockListing; // In real app, fetch based on id

  const handleBooking = () => {
    console.log("Booking submitted:", {
      listingId: id,
      ...bookingData,
    });
    setShowBookingDialog(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/browse">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to listings
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {listing.name}
            </h1>
            {listing.available && (
              <Badge className="bg-green-100 text-green-800">Available</Badge>
            )}
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {listing.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {listing.rating} ({listing.reviewCount} reviews)
            </span>
            <Badge variant="outline">{listing.type}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart
              className={`h-5 w-5 ${
                isSaved ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <Card className="overflow-hidden">
        <div className="bg-muted relative h-64 md:h-96">
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="text-muted-foreground h-16 w-16" />
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2"
            onClick={prevImage}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2"
            onClick={nextImage}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {listing.images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About this place</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {listing.description}
              </p>
            </CardContent>
          </Card>

          {/* Room Details */}
          <Card>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Home className="mx-auto mb-2 h-6 w-6" />
                  <p className="text-muted-foreground text-sm">Room Type</p>
                  <p className="font-medium">{listing.roomType}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Users className="mx-auto mb-2 h-6 w-6" />
                  <p className="text-muted-foreground text-sm">Capacity</p>
                  <p className="font-medium">
                    {listing.capacity}{" "}
                    {listing.capacity > 1 ? "persons" : "person"}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Home className="mx-auto mb-2 h-6 w-6" />
                  <p className="text-muted-foreground text-sm">Size</p>
                  <p className="font-medium">{listing.size}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Home className="mx-auto mb-2 h-6 w-6" />
                  <p className="text-muted-foreground text-sm">Floor</p>
                  <p className="font-medium">{listing.floor}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {listing.amenities.map((amenity) => (
                  <div
                    key={amenity.key}
                    className={`flex items-center gap-3 rounded-lg p-3 ${
                      amenity.included
                        ? "bg-green-50 text-green-800"
                        : "bg-muted text-muted-foreground line-through"
                    }`}
                  >
                    {amenityIcons[amenity.key]}
                    <span>{amenity.label}</span>
                    {amenity.included && <Check className="ml-auto h-4 w-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* House Rules */}
          <Card>
            <CardHeader>
              <CardTitle>House Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {listing.houseRules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground">{index + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                  {listing.reviewCount} reviews • {listing.rating} average
                  rating
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(listing.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback>
                        {getInitials(review.author)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{review.author}</p>
                          <p className="text-muted-foreground text-sm">
                            Stayed for {review.stayDuration}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-2">
                        {review.comment}
                      </p>
                      <p className="text-muted-foreground mt-2 text-xs">
                        {formatDate(review.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Reviews
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Booking Card */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {formatCurrency(listing.price)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <CardDescription>
                Security deposit: {formatCurrency(listing.depositAmount)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available from</span>
                  <span className="font-medium">
                    {formatDate(listing.availableFrom)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Minimum stay</span>
                  <span className="font-medium">{listing.minStay}</span>
                </div>
              </div>

              <Separator />

              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowBookingDialog(true)}
                disabled={!listing.available}
              >
                {listing.available ? "Request to Book" : "Not Available"}
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/messages?property=${listing.id}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Landlord
                </Link>
              </Button>

              <p className="text-muted-foreground text-center text-xs">
                You won&apos;t be charged yet. The landlord will review your
                request.
              </p>
            </CardContent>
          </Card>

          {/* Landlord Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Meet your landlord</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={listing.landlord.avatar} />
                  <AvatarFallback className="text-lg">
                    {getInitials(listing.landlord.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{listing.landlord.name}</p>
                    {listing.landlord.verified && (
                      <Shield className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Member since {listing.landlord.memberSince}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Response rate</p>
                  <p className="font-medium">
                    {listing.landlord.responseRate}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Response time</p>
                  <p className="font-medium">{listing.landlord.responseTime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Properties</p>
                  <p className="font-medium">{listing.landlord.properties}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Verified</p>
                  <p className="font-medium text-green-600">Yes</p>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/messages?landlord=${listing.landlord.id}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request to Book</DialogTitle>
            <DialogDescription>
              Submit a booking request for {listing.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Monthly rent</span>
                <span className="font-semibold">
                  {formatCurrency(listing.price)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Security deposit</span>
                <span className="font-semibold">
                  {formatCurrency(listing.depositAmount)}
                </span>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="font-medium">Total to pay on move-in</span>
                <span className="text-lg font-bold">
                  {formatCurrency(listing.price + listing.depositAmount)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkIn">Preferred Move-in Date</Label>
              <Input
                id="checkIn"
                type="date"
                value={bookingData.checkIn}
                onChange={(e) =>
                  setBookingData({ ...bookingData, checkIn: e.target.value })
                }
                min={listing.availableFrom}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Intended Stay Duration</Label>
              <select
                id="duration"
                value={bookingData.duration}
                onChange={(e) =>
                  setBookingData({ ...bookingData, duration: e.target.value })
                }
                className="bg-background w-full rounded-md border px-3 py-2"
              >
                <option value="6">6 months</option>
                <option value="12">1 year</option>
                <option value="24">2 years</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message to Landlord (Optional)</Label>
              <textarea
                id="message"
                value={bookingData.message}
                onChange={(e) =>
                  setBookingData({ ...bookingData, message: e.target.value })
                }
                placeholder="Introduce yourself and mention why you're interested..."
                className="bg-background min-h-[100px] w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="text-muted-foreground flex items-start gap-2 text-sm">
              <Clock className="mt-0.5 h-4 w-4" />
              <span>
                The landlord typically responds {listing.landlord.responseTime}.
                You&apos;ll receive a notification once they review your
                request.
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBookingDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBooking} disabled={!bookingData.checkIn}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
