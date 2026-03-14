"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useLayoutEffect } from "react";

// Types for multitenancy
export interface Property {
  id: string;
  name: string;
  address: string;
  totalRooms: number;
  occupiedRooms: number;
  status: "active" | "inactive" | "maintenance";
}

interface PropertyContextType {
  currentProperty: Property | null;
  properties: Property[];
  setCurrentProperty: (property: Property) => void;
  isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// Mock data for demonstration - replace with API calls
const mockProperties: Property[] = [
  {
    id: "prop-1",
    name: "Sunrise Boarding House",
    address: "123 Main Street, Downtown",
    totalRooms: 20,
    occupiedRooms: 15,
    status: "active",
  },
  {
    id: "prop-2",
    name: "Oceanview Residence",
    address: "456 Beach Road, Seaside",
    totalRooms: 30,
    occupiedRooms: 28,
    status: "active",
  },
  {
    id: "prop-3",
    name: "Mountain Lodge",
    address: "789 Highland Ave, Uptown",
    totalRooms: 15,
    occupiedRooms: 10,
    status: "maintenance",
  },
];

function getInitialProperty(): Property | null {
  if (typeof window === "undefined") return null;
  const savedPropertyId = localStorage.getItem("havenspace-current-property");
  if (savedPropertyId) {
    const savedProperty = mockProperties.find((p) => p.id === savedPropertyId);
    return savedProperty || mockProperties[0];
  }
  return mockProperties[0];
}

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties] = useState<Property[]>(mockProperties);
  const [currentProperty, setCurrentPropertyState] = useState<Property | null>(getInitialProperty);
  const isLoadingRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    // Mark loading as complete after initial render using layout effect
    if (isLoadingRef.current) {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const setCurrentProperty = useCallback((property: Property) => {
    setCurrentPropertyState(property);
    localStorage.setItem("havenspace-current-property", property.id);
  }, []);

  return (
    <PropertyContext.Provider
      value={{
        currentProperty,
        properties,
        setCurrentProperty,
        isLoading,
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
