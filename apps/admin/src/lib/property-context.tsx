"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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
  parkingType?: "none" | "street" | "garage" | "lot";
  amenities?: string[];
  imageCount?: number;
}

interface PropertyContextType {
  currentProperty: Property | null;
  setCurrentProperty: (property: Property | null) => void;
  properties: Property[];
  setProperties: (properties: Property[]) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined
);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  return (
    <PropertyContext.Provider
      value={{
        currentProperty,
        setCurrentProperty,
        properties,
        setProperties,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperty must be used within a PropertyProvider");
  }
  return context;
}
