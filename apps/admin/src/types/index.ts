// Shared type definitions for BHMS Admin

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  isPrimary: boolean;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface PropertyRule {
  id: string;
  title: string;
  description: string;
  icon?: string;
  category?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  status: "active" | "inactive" | "maintenance";
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  managerName?: string;
  parkingSpaces?: number;
  parkingType?: "none" | "free" | "paid";
  parkingRate?: number;
  amenities?: PropertyAmenity[];
  images?: PropertyImage[];
  rules?: PropertyRule[];
  location?: GeoLocation;
  imageCount?: number;
  nearbyLandmarks?: string[];
  publicTransport?: string[];
  totalRooms?: number;
  occupiedRooms?: number;
  monthlyRevenue?: number;
  minRent?: number;
  maxRent?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Landmark {
  name: string;
  distance: string;
  type: "school" | "hospital" | "mall" | "transport" | "other";
}

export interface TransportLink {
  name: string;
  type: "bus" | "jeepney" | "train" | "taxi" | "other";
  distance: string;
}
