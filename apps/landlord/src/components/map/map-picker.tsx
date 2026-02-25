"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/leaflet.css";

// Malaybalay City, Bukidnon - service coverage area
export const MALAYBALAY_BOUNDS = {
  north: 8.2200,
  south: 8.1000,
  east: 125.1700,
  west: 125.0800,
};

export const MALAYBALAY_CENTER: [number, number] = [8.1575, 125.1276];
const DEFAULT_ZOOM = 14;

// Pin marker
const pinIcon = L.divIcon({
  className: "map-pin-marker",
  html: `<div style="position:relative;">
    <div style="background: #ef4444; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 12px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface MapPickerProps {
  /** Current latitude or null if no pin yet */
  latitude: number | null;
  /** Current longitude or null if no pin yet */
  longitude: number | null;
  /** Called when user clicks the map to place/move pin */
  onChange: (lat: number, lng: number) => void;
  /** Whether the map is read-only (no clicking to place pins) */
  readOnly?: boolean;
  /** CSS height for the map container */
  height?: string;
  /** Additional class name */
  className?: string;
}

/**
 * Interactive map component for the landlord dashboard.
 * Allows placing a pin by clicking on the map.
 * Restricts placement to Malaybalay City, Bukidnon service area.
 */
export default function MapPicker({
  latitude,
  longitude,
  onChange,
  readOnly = false,
  height = "400px",
  className = "",
}: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Initialize Leaflet map
  useEffect(() => {
    if (!containerRef.current) return;

    const initialCenter: [number, number] =
      latitude !== null && longitude !== null
        ? [latitude, longitude]
        : MALAYBALAY_CENTER;

    const initialZoom =
      latitude !== null && longitude !== null ? 16 : DEFAULT_ZOOM;

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      maxBounds: L.latLngBounds(
        [MALAYBALAY_BOUNDS.south - 0.02, MALAYBALAY_BOUNDS.west - 0.02],
        [MALAYBALAY_BOUNDS.north + 0.02, MALAYBALAY_BOUNDS.east + 0.02]
      ),
      minZoom: 12,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Draw a rectangle showing the Malaybalay service area
    const bounds = L.latLngBounds(
      [MALAYBALAY_BOUNDS.south, MALAYBALAY_BOUNDS.west],
      [MALAYBALAY_BOUNDS.north, MALAYBALAY_BOUNDS.east]
    );
    L.rectangle(bounds, {
      color: "#3b82f6",
      weight: 2,
      fillOpacity: 0.03,
      dashArray: "8 4",
    }).addTo(map);

    // Click handler for placing pins
    if (!readOnly) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        // Validate within Malaybalay bounds
        if (
          lat < MALAYBALAY_BOUNDS.south ||
          lat > MALAYBALAY_BOUNDS.north ||
          lng < MALAYBALAY_BOUNDS.west ||
          lng > MALAYBALAY_BOUNDS.east
        ) {
          // Show a temporary popup indicating out of bounds
          L.popup()
            .setLatLng(e.latlng)
            .setContent(
              `<div style="color:#ef4444;font-weight:600;font-size:13px;">
                Outside service area!<br/>
                <span style="font-weight:400;color:#6b7280;font-size:12px;">
                  Please pin within Malaybalay City, Bukidnon.
                </span>
              </div>`
            )
            .openOn(map);
          return;
        }

        // Place or move the marker
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const marker = L.marker([lat, lng], {
            icon: pinIcon,
            draggable: true,
          }).addTo(map);

          marker.on("dragend", () => {
            const pos = marker.getLatLng();
            // Validate drag position
            if (
              pos.lat < MALAYBALAY_BOUNDS.south ||
              pos.lat > MALAYBALAY_BOUNDS.north ||
              pos.lng < MALAYBALAY_BOUNDS.west ||
              pos.lng > MALAYBALAY_BOUNDS.east
            ) {
              // Snap back to previous position
              if (latitude !== null && longitude !== null) {
                marker.setLatLng([latitude, longitude]);
              } else {
                marker.setLatLng(MALAYBALAY_CENTER);
              }
              return;
            }
            onChangeRef.current(pos.lat, pos.lng);
          });

          markerRef.current = marker;
        }

        onChangeRef.current(lat, lng);
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly]);

  // Sync marker position when lat/lng change externally
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (latitude !== null && longitude !== null) {
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        const marker = L.marker([latitude, longitude], {
          icon: pinIcon,
          draggable: !readOnly,
        }).addTo(map);

        if (!readOnly) {
          marker.on("dragend", () => {
            const pos = marker.getLatLng();
            if (
              pos.lat < MALAYBALAY_BOUNDS.south ||
              pos.lat > MALAYBALAY_BOUNDS.north ||
              pos.lng < MALAYBALAY_BOUNDS.west ||
              pos.lng > MALAYBALAY_BOUNDS.east
            ) {
              if (latitude !== null && longitude !== null) {
                marker.setLatLng([latitude, longitude]);
              }
              return;
            }
            onChangeRef.current(pos.lat, pos.lng);
          });
        }

        markerRef.current = marker;
      }
    } else if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [latitude, longitude, readOnly]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%" }}
      className={`rounded-lg overflow-hidden border ${className}`}
    />
  );
}
