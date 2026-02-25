"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { BoardingHouse } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

// Malaybalay City, Bukidnon - default center
const MALAYBALAY_CENTER: [number, number] = [8.1575, 125.1276];
const DEFAULT_ZOOM = 14;

// Boarding house marker (blue)
const defaultIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background: hsl(221.2 83.2% 53.3%); width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Selected marker (larger blue)
const selectedIcon = L.divIcon({
  className: "custom-marker selected",
  html: `<div style="background: hsl(221.2 83.2% 53.3%); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 12px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// User location marker (pulsing green)
const userLocationIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div style="position:relative;">
    <div style="background: #22c55e; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); position:relative; z-index:2;"></div>
    <div style="background: rgba(34, 197, 94, 0.2); width: 40px; height: 40px; border-radius: 50%; position:absolute; top: -12px; left: -12px; z-index:1; animation: pulse 2s infinite;"></div>
  </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface MapViewProps {
  listings: BoardingHouse[];
  selectedListing: BoardingHouse | null;
  onSelectListing: (listing: BoardingHouse | null) => void;
  userLocation: { lat: number; lng: number } | null;
}

export default function MapView({
  listings,
  selectedListing,
  onSelectListing,
  userLocation,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const onSelectListingRef = useRef(onSelectListing);
  onSelectListingRef.current = onSelectListing;

  // Initialize the Leaflet map once
  useEffect(() => {
    if (!containerRef.current) return;

    const initialCenter: [number, number] = userLocation
      ? [userLocation.lat, userLocation.lng]
      : MALAYBALAY_CENTER;

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
      userMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update user location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const marker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userLocationIcon,
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup(
          `<div style="text-align:center;padding:4px;">
            <strong>Your Location</strong><br/>
            <span style="font-size:12px;color:#6b7280;">Malaybalay City, Bukidnon</span>
          </div>`
        );

      userMarkerRef.current = marker;
    }
  }, [userLocation]);

  // Sync boarding house markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    listings.forEach((listing) => {
      const isSelected = selectedListing?.id === listing.id;
      const icon = isSelected ? selectedIcon : defaultIcon;

      const marker = L.marker([listing.latitude, listing.longitude], { icon })
        .addTo(map)
        .on("click", () => onSelectListingRef.current(listing));

      const ratingHtml = listing.rating
        ? `<span style="font-size:12px;background:#f3f4f6;padding:2px 8px;border-radius:4px;">⭐ ${listing.rating.toFixed(1)}</span>`
        : "";

      const availabilityColor =
        listing.availableRooms > 0 ? "#22c55e" : "#ef4444";
      const availabilityText =
        listing.availableRooms > 0
          ? `${listing.availableRooms} rooms available`
          : "Fully occupied";

      marker.bindPopup(
        `<div style="min-width:220px">
          <h3 style="font-weight:600;margin:0 0 4px 0;font-size:15px;">${listing.name}</h3>
          <p style="font-size:13px;color:#6b7280;margin:0 0 4px 0;">${listing.address}</p>
          <p style="font-size:12px;color:#9ca3af;margin:0 0 8px 0;">${listing.city}, ${listing.province}</p>
          <p style="font-weight:600;color:hsl(221.2 83.2% 53.3%);margin:0 0 8px 0;">
            ${formatCurrency(listing.priceMin)} - ${formatCurrency(listing.priceMax)}/mo
          </p>
          <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
            <span style="font-size:12px;background:#f3f4f6;padding:2px 8px;border-radius:4px;color:${availabilityColor};">${availabilityText}</span>
            ${ratingHtml}
          </div>
          <a href="/listings/${listing.id}" style="display:block;text-align:center;background:hsl(221.2 83.2% 53.3%);color:white;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:13px;">View Details</a>
        </div>`
      );

      markersRef.current.push(marker);
    });
  }, [listings, selectedListing]);

  // Fly to selected listing
  useEffect(() => {
    if (selectedListing && mapRef.current) {
      mapRef.current.flyTo(
        [selectedListing.latitude, selectedListing.longitude],
        16,
        { duration: 1 }
      );
    }
  }, [selectedListing]);

  // Center on user location when first detected
  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], DEFAULT_ZOOM, {
        duration: 1.5,
      });
    }
    // Only run when userLocation first becomes available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation !== null]);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.6; }
        }
      `}</style>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </>
  );
}
