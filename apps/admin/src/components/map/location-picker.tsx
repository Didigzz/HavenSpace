"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { MapPin, Search, Crosshair, Loader2 } from "lucide-react";
import { Button } from "@havenspace/ui";
import { Input } from "@havenspace/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/ui";
import type { GeoLocation } from "@/types";

interface LocationPickerProps {
  value?: GeoLocation;
  onChange: (location: GeoLocation) => void;
  height?: string;
}

// Dynamic import for Leaflet to avoid SSR issues
const MapComponent = React.lazy(() => import("./map-view"));

export function LocationPicker({ value, onChange, height = "400px" }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Default to Manila, Philippines if no value
  const defaultLocation: GeoLocation = {
    latitude: 14.5995,
    longitude: 120.9842,
    address: "Manila, Philippines",
  };

  const currentLocation = value || defaultLocation;

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(true);

    try {
      // Using Nominatim (OpenStreetMap) for geocoding - free and no API key required
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();

      const results: GeoLocation[] = data.map((item: { lat: string; lon: string; display_name: string }) => ({
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        address: item.display_name,
      }));

      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSelectResult = (location: GeoLocation) => {
    onChange(location);
    setShowResults(false);
    setSearchQuery(location.address || "");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          onChange({
            latitude,
            longitude,
            address: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        } catch {
          onChange({
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        }

        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  const handleMapClick = async (lat: number, lng: number) => {
    // Reverse geocode to get address
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      onChange({
        latitude: lat,
        longitude: lng,
        address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
    } catch {
      onChange({
        latitude: lat,
        longitude: lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Property Location
        </CardTitle>
        <CardDescription>
          Search for an address or click on the map to pin the exact location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for an address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover shadow-lg">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent"
                    onClick={() => handleSelectResult(result)}
                  >
                    <MapPin className="mr-2 inline-block h-4 w-4 text-muted-foreground" />
                    {result.address}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button type="button" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Crosshair className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Map */}
        <div className="relative overflow-hidden rounded-lg border" style={{ height }}>
          <React.Suspense
            fallback={
              <div className="flex h-full items-center justify-center bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <MapComponent
              center={[currentLocation.latitude, currentLocation.longitude]}
              markerPosition={[currentLocation.latitude, currentLocation.longitude]}
              onMapClick={handleMapClick}
              zoom={15}
            />
          </React.Suspense>
        </div>

        {/* Current Location Display */}
        {currentLocation.address && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-sm font-medium">Selected Location:</p>
            <p className="text-sm text-muted-foreground">{currentLocation.address}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Coordinates: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
