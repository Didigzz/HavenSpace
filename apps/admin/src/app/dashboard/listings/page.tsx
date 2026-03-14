"use client";

import * as React from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  MapPin,
  Star,
  Flag,
  Ban,
  ImageIcon,
  ExternalLink,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@havenspace/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate, formatCurrency, getInitials, getRelativeTime } from "@/lib/utils";

type ListingStatus = "active" | "pending" | "suspended" | "flagged";

interface ListingData {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  rooms: number;
  rating: number;
  reviewCount: number;
  status: ListingStatus;
  images: string[];
  landlord: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  flagReason?: string;
  flaggedAt?: Date;
  flaggedBy?: string;
}

// Mock listings data
const mockListings: ListingData[] = [
  {
    id: "1",
    title: "Sunny View Boarding House",
    description: "A modern boarding house with excellent amenities, near universities and commercial areas.",
    address: "123 Main Street",
    city: "Manila",
    price: 5000,
    rooms: 10,
    rating: 4.5,
    reviewCount: 28,
    status: "active",
    images: ["/placeholder.jpg"],
    landlord: {
      id: "l1",
      name: "Maria Santos",
      email: "maria@example.com",
      avatar: null,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: "2",
    title: "Green Residence Dormitory",
    description: "Peaceful dormitory in a quiet neighborhood with lush garden surroundings.",
    address: "456 Oak Avenue",
    city: "Quezon City",
    price: 4500,
    rooms: 8,
    rating: 4.2,
    reviewCount: 15,
    status: "pending",
    images: ["/placeholder.jpg"],
    landlord: {
      id: "l2",
      name: "Juan Cruz",
      email: "juan@example.com",
      avatar: null,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "3",
    title: "Budget Friendly BH",
    description: "Affordable accommodation for students and young professionals.",
    address: "789 Pine Road",
    city: "Makati",
    price: 3000,
    rooms: 15,
    rating: 3.8,
    reviewCount: 42,
    status: "flagged",
    images: ["/placeholder.jpg"],
    landlord: {
      id: "l3",
      name: "Pedro Garcia",
      email: "pedro@example.com",
      avatar: null,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    flagReason: "Misleading photos - actual property looks different from images",
    flaggedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    flaggedBy: "Anonymous User",
  },
  {
    id: "4",
    title: "Premium Suites Manila",
    description: "High-end accommodation with premium amenities and services.",
    address: "321 Elm Street",
    city: "Pasig",
    price: 8000,
    rooms: 20,
    rating: 4.8,
    reviewCount: 56,
    status: "active",
    images: ["/placeholder.jpg"],
    landlord: {
      id: "l4",
      name: "Ana Reyes",
      email: "ana@example.com",
      avatar: null,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
  {
    id: "5",
    title: "Student Housing Complex",
    description: "Purpose-built student accommodation near major universities.",
    address: "654 Maple Drive",
    city: "Taguig",
    price: 4000,
    rooms: 50,
    rating: 4.0,
    reviewCount: 89,
    status: "suspended",
    images: ["/placeholder.jpg"],
    landlord: {
      id: "l5",
      name: "Carlos Tan",
      email: "carlos@example.com",
      avatar: null,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
];

const statusColors: Record<ListingStatus, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  flagged: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

const statusIcons: Record<ListingStatus, React.ComponentType<{ className?: string }>> = {
  active: CheckCircle,
  pending: AlertTriangle,
  suspended: Ban,
  flagged: Flag,
};

export default function ListingsPage() {
  const [filter, setFilter] = React.useState<"all" | ListingStatus>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedListing, setSelectedListing] = React.useState<ListingData | null>(null);
  const [actionDialog, setActionDialog] = React.useState<{
    type: "approve" | "suspend" | "unsuspend" | "dismiss" | null;
    listing: ListingData | null;
  }>({ type: null, listing: null });
  const [actionNotes, setActionNotes] = React.useState("");

  const filteredListings = mockListings.filter((listing) => {
    const matchesFilter = filter === "all" || listing.status === filter;
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.landlord.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const listingCounts = {
    all: mockListings.length,
    active: mockListings.filter((l) => l.status === "active").length,
    pending: mockListings.filter((l) => l.status === "pending").length,
    flagged: mockListings.filter((l) => l.status === "flagged").length,
    suspended: mockListings.filter((l) => l.status === "suspended").length,
  };

  const handleAction = (type: typeof actionDialog.type, listing: ListingData) => {
    setActionDialog({ type, listing });
    setActionNotes("");
  };

  const confirmAction = () => {
    console.log(`${actionDialog.type} listing ${actionDialog.listing?.id} with notes: ${actionNotes}`);
    setActionDialog({ type: null, listing: null });
    setActionNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listings Moderation</h1>
          <p className="text-muted-foreground">
            Review and moderate boarding house listings
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listingCounts.all}</div>
            <p className="text-xs text-muted-foreground">All registered listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listingCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged</CardTitle>
            <Flag className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listingCounts.flagged}</div>
            <p className="text-xs text-muted-foreground">Reported by users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listingCounts.suspended}</div>
            <p className="text-xs text-muted-foreground">Currently inactive</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All ({listingCounts.all})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({listingCounts.pending})</TabsTrigger>
            <TabsTrigger value="flagged">Flagged ({listingCounts.flagged})</TabsTrigger>
            <TabsTrigger value="active">Active ({listingCounts.active})</TabsTrigger>
            <TabsTrigger value="suspended">Suspended ({listingCounts.suspended})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            className="w-full pl-9 md:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredListings.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No listings found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "No listings match the selected filter"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredListings.map((listing) => {
            const StatusIcon = statusIcons[listing.status];
            return (
              <Card key={listing.id} className="overflow-hidden">
                {/* Image */}
                <div className="relative h-40 bg-muted">
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <Badge
                    className={cn(
                      "absolute right-2 top-2",
                      statusColors[listing.status]
                    )}
                  >
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {listing.status}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Title and Rating */}
                    <div>
                      <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {listing.address}, {listing.city}
                        </span>
                      </div>
                    </div>

                    {/* Price and Rating */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">
                        {formatCurrency(listing.price)}/mo
                      </span>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{listing.rating}</span>
                        <span className="text-muted-foreground">
                          ({listing.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Landlord */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(listing.landlord.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {listing.landlord.name}
                      </span>
                    </div>

                    {/* Flag Reason */}
                    {listing.status === "flagged" && listing.flagReason && (
                      <div className="rounded-lg bg-orange-50 dark:bg-orange-950 p-2 text-sm">
                        <p className="font-medium text-orange-800 dark:text-orange-200">
                          Flagged Reason:
                        </p>
                        <p className="text-orange-700 dark:text-orange-300 line-clamp-2">
                          {listing.flagReason}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedListing(listing)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {listing.status === "pending" && (
                            <DropdownMenuItem
                              onClick={() => handleAction("approve", listing)}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve Listing
                            </DropdownMenuItem>
                          )}
                          {listing.status === "flagged" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleAction("dismiss", listing)}
                                className="text-green-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Dismiss Flag
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction("suspend", listing)}
                                className="text-destructive"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend Listing
                              </DropdownMenuItem>
                            </>
                          )}
                          {listing.status === "active" && (
                            <DropdownMenuItem
                              onClick={() => handleAction("suspend", listing)}
                              className="text-destructive"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend Listing
                            </DropdownMenuItem>
                          )}
                          {listing.status === "suspended" && (
                            <DropdownMenuItem
                              onClick={() => handleAction("unsuspend", listing)}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Reactivate Listing
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Listing Details Dialog */}
      <Dialog
        open={!!selectedListing}
        onOpenChange={(open) => !open && setSelectedListing(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedListing && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedListing.title}</DialogTitle>
                <DialogDescription>
                  Listing ID: {selectedListing.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <Badge className={cn(statusColors[selectedListing.status])}>
                    {selectedListing.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last updated {getRelativeTime(selectedListing.updatedAt)}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedListing.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {selectedListing.address}, {selectedListing.city}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Monthly Rent</p>
                    <p className="font-medium">{formatCurrency(selectedListing.price)}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Available Rooms</p>
                    <p className="font-medium">{selectedListing.rooms} rooms</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-medium flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {selectedListing.rating} ({selectedListing.reviewCount} reviews)
                    </p>
                  </div>
                </div>

                {/* Landlord Info */}
                <div>
                  <h4 className="font-semibold mb-2">Landlord</h4>
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(selectedListing.landlord.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedListing.landlord.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedListing.landlord.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flag Info */}
                {selectedListing.status === "flagged" && selectedListing.flagReason && (
                  <div>
                    <h4 className="font-semibold mb-2 text-orange-600">Flag Details</h4>
                    <div className="rounded-lg bg-orange-50 dark:bg-orange-950 p-4">
                      <p className="text-orange-800 dark:text-orange-200">
                        {selectedListing.flagReason}
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                        Flagged by {selectedListing.flaggedBy}{" "}
                        {selectedListing.flaggedAt && getRelativeTime(selectedListing.flaggedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="text-sm text-muted-foreground">
                  <p>Created: {formatDate(selectedListing.createdAt)}</p>
                  <p>Last updated: {formatDate(selectedListing.updatedAt)}</p>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setSelectedListing(null)}>
                  Close
                </Button>
                {selectedListing.status === "pending" && (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setSelectedListing(null);
                      handleAction("approve", selectedListing);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                )}
                {selectedListing.status === "flagged" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedListing(null);
                        handleAction("dismiss", selectedListing);
                      }}
                    >
                      Dismiss Flag
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedListing(null);
                        handleAction("suspend", selectedListing);
                      }}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Suspend
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.type !== null}
        onOpenChange={() => setActionDialog({ type: null, listing: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "approve" && "Approve Listing"}
              {actionDialog.type === "suspend" && "Suspend Listing"}
              {actionDialog.type === "unsuspend" && "Reactivate Listing"}
              {actionDialog.type === "dismiss" && "Dismiss Flag"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "approve" &&
                "This listing will become visible to all users on the platform."}
              {actionDialog.type === "suspend" &&
                "This listing will be hidden from the platform. The landlord will be notified."}
              {actionDialog.type === "unsuspend" &&
                "This listing will become visible again on the platform."}
              {actionDialog.type === "dismiss" &&
                "The flag will be removed and the listing will remain active."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {actionDialog.type === "suspend" ? "Reason (required)" : "Notes (optional)"}
              </label>
              <textarea
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
                rows={4}
                placeholder={
                  actionDialog.type === "suspend"
                    ? "Provide a reason for suspension..."
                    : "Add any notes..."
                }
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ type: null, listing: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={actionDialog.type === "suspend" && !actionNotes.trim()}
              className={cn(
                actionDialog.type === "approve" && "bg-green-600 hover:bg-green-700",
                actionDialog.type === "unsuspend" && "bg-green-600 hover:bg-green-700",
                actionDialog.type === "dismiss" && "bg-green-600 hover:bg-green-700",
                actionDialog.type === "suspend" && "bg-destructive hover:bg-destructive/90"
              )}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
