import { z } from "zod";

// Malaybalay City, Bukidnon geographic bounds
// Approximate bounding box for coordinate validation
export const MALAYBALAY_BOUNDS = {
  north: 8.22,
  south: 8.1,
  east: 125.17,
  west: 125.08,
  center: { lat: 8.1575, lng: 125.1276 },
} as const;

export const latitudeSchema = z.coerce
  .number()
  .min(-90, "Latitude must be between -90 and 90")
  .max(90, "Latitude must be between -90 and 90");

export const longitudeSchema = z.coerce
  .number()
  .min(-180, "Longitude must be between -180 and 180")
  .max(180, "Longitude must be between -180 and 180");

export const malaybalayLatitudeSchema = z.coerce
  .number()
  .min(
    MALAYBALAY_BOUNDS.south,
    "Location must be within Malaybalay City, Bukidnon"
  )
  .max(
    MALAYBALAY_BOUNDS.north,
    "Location must be within Malaybalay City, Bukidnon"
  );

export const malaybalayLongitudeSchema = z.coerce
  .number()
  .min(
    MALAYBALAY_BOUNDS.west,
    "Location must be within Malaybalay City, Bukidnon"
  )
  .max(
    MALAYBALAY_BOUNDS.east,
    "Location must be within Malaybalay City, Bukidnon"
  );

export const coordinatesSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});

export const malaybalayCoordinatesSchema = z.object({
  latitude: malaybalayLatitudeSchema,
  longitude: malaybalayLongitudeSchema,
});

export const createPropertySchema = z.object({
  name: z.string().min(1, "Property name is required").max(200),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required").max(500),
  city: z.string().min(1, "City is required").max(100),
  province: z.string().optional(),
  zipCode: z.string().optional(),
  latitude: malaybalayLatitudeSchema,
  longitude: malaybalayLongitudeSchema,
  monthlyRent: z.coerce.number().min(0, "Monthly rent must be positive"),
  totalRooms: z.coerce.number().int().min(1, "Must have at least 1 room"),
  availableRooms: z.coerce.number().int().min(0),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  id: z.string().min(1, "Property ID is required"),
});

export const updatePropertyLocationSchema = z.object({
  id: z.string().min(1, "Property ID is required"),
  latitude: malaybalayLatitudeSchema,
  longitude: malaybalayLongitudeSchema,
});

export const propertyFilterSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  amenities: z.array(z.string()).optional(),
  availableOnly: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;
export type MalaybalayCoordinates = z.infer<typeof malaybalayCoordinatesSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type UpdatePropertyLocationInput = z.infer<
  typeof updatePropertyLocationSchema
>;
export type PropertyFilterInput = z.infer<typeof propertyFilterSchema>;
