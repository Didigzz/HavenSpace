"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@bhms/ui";
import { Search, List, X, MapPin, Navigation, AlertTriangle, Filter } from "lucide-react";
import { mockBoardingHouses } from "@/lib/mock-data";
import { BoardingHouse } from "@/lib/types";
import { MapListingCard } from "./map-listing-card";

// Dynamic import for Leaflet (no SSR)
const MapContainer = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-muted animate-pulse flex items-center justify-center">
      <div className="text-muted-foreground">Loading map...</div>
    </div>
  ),
});

type LocationStatus = "idle" | "loading" | "success" | "denied" | "error";

export function MapContent() {
  const [selectedListing, setSelectedListing] = useState<BoardingHouse | null>(
    null
  );
  const [showList, setShowList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationError, setLocationError] = useState<string | null>(null);

  // Request user geolocation on mount
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationStatus("loading");
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("success");
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationStatus("denied");
            setLocationError(
              "Location access denied. The map will default to Malaybalay City center."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationStatus("error");
            setLocationError(
              "Location information is unavailable. Using default location."
            );
            break;
          case error.TIMEOUT:
            setLocationStatus("error");
            setLocationError(
              "Location request timed out. Using default location."
            );
            break;
          default:
            setLocationStatus("error");
            setLocationError(
              "Unable to detect your location. Using default location."
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Filter listings
  const filteredListings = mockBoardingHouses.filter((bh) => {
    // Available-only filter: only show boarding houses with available rooms
    if (showAvailableOnly && bh.availableRooms <= 0) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        bh.name.toLowerCase().includes(q) ||
        bh.address.toLowerCase().includes(q) ||
        bh.city.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="flex-1 flex relative">
      {/* Search Bar & Filters */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-2 md:left-4 md:right-auto md:w-96">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-background rounded-lg border shadow-lg px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search boarding houses in Malaybalay..."
              className="flex-1 bg-transparent text-sm outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="bg-background shadow-lg"
            onClick={() => setShowList(!showList)}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium shadow-md transition-colors ${
              showAvailableOnly
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground border"
            }`}
          >
            <Filter className="h-3 w-3" />
            Available Only
          </button>

          {locationStatus === "success" && (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-md">
              <Navigation className="h-3 w-3" />
              Location detected
            </span>
          )}

          {locationStatus === "loading" && (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-background text-muted-foreground shadow-md border animate-pulse">
              <Navigation className="h-3 w-3" />
              Detecting location...
            </span>
          )}

          {(locationStatus === "denied" || locationStatus === "error") && (
            <button
              onClick={requestLocation}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 shadow-md hover:bg-yellow-200 transition-colors"
              title={locationError || "Retry location"}
            >
              <AlertTriangle className="h-3 w-3" />
              Retry Location
            </button>
          )}
        </div>

        {/* Location error banner */}
        {locationError && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-800 shadow-md">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>{locationError}</span>
            <button
              onClick={() => setLocationError(null)}
              className="ml-auto shrink-0"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Listings Sidebar (Mobile: Bottom Sheet, Desktop: Side Panel) */}
      {showList && (
        <div className="absolute bottom-0 left-0 right-0 md:relative md:w-96 z-[1000] bg-background border-t md:border-t-0 md:border-r max-h-[50vh] md:max-h-none overflow-y-auto">
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10">
            <div>
              <h3 className="font-semibold">Boarding Houses</h3>
              <p className="text-sm text-muted-foreground">
                {filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""} in Malaybalay City
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowList(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="divide-y">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <MapListingCard
                  key={listing.id}
                  listing={listing}
                  isSelected={selectedListing?.id === listing.id}
                  onClick={() => setSelectedListing(listing)}
                />
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No boarding houses found</p>
                <p className="text-xs mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="flex-1">
        <MapContainer
          listings={filteredListings}
          selectedListing={selectedListing}
          onSelectListing={setSelectedListing}
          userLocation={userLocation}
        />
      </div>

      {/* Selected Listing Preview (Mobile) */}
      {selectedListing && !showList && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] md:hidden">
          <div className="bg-background rounded-lg border shadow-lg p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <h3 className="font-semibold line-clamp-1">
                  {selectedListing.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">{selectedListing.address}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="mt-1 font-semibold text-primary">
                    ₱{selectedListing.priceMin.toLocaleString()} - ₱
                    {selectedListing.priceMax.toLocaleString()}/mo
                  </span>
                  {selectedListing.availableRooms > 0 ? (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {selectedListing.availableRooms} available
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      Full
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedListing(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
