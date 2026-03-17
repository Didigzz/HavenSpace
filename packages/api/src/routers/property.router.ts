import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { LandlordTRPCContext, TRPCContext } from "../types/index";
import {
  createPropertySchema,
  updatePropertySchema,
  propertyFilterSchema,
} from "@havenspace/validation";

// Type helpers
interface LandlordCtx<TInput = unknown> {
  ctx: LandlordTRPCContext;
  input: TInput;
}

type GetAllInput = z.infer<typeof getAllInputSchema>;

type GetByIdInput = z.infer<typeof getPropertyByIdSchema>;
type CreatePropertyInput = z.infer<typeof createPropertySchema>;
type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
type DeletePropertyInput = z.infer<typeof deletePropertySchema>;

const getPropertyByIdSchema = z.object({
  id: z.string(),
});

const getAllInputSchema = propertyFilterSchema.extend({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
});

const deletePropertySchema = z.object({
  id: z.string(),
});

/**
 * Property router for managing boarding house properties
 */
export const createPropertyRouter = (
  protectedProcedure: any,
  landlordProcedure?: any
) => {
  // Use protectedProcedure if landlordProcedure is not provided
  const landlordProc = landlordProcedure || protectedProcedure;

  return createTRPCRouter({
    // Get all properties (public - for browsing)
    getAll: publicProcedure
      .input(getAllInputSchema)
      .query(async ({ ctx, input }: { ctx: TRPCContext; input: GetAllInput }) => {
        const { page, limit, query, city, priceMin, priceMax, amenities } =
          input;
        const skip = (page - 1) * limit;

        const where: {
          isActive: boolean;
          OR?: Array<{
            name?: { contains: string; mode: "insensitive" };
            description?: { contains: string; mode: "insensitive" };
            address?: { contains: string; mode: "insensitive" };
          }>;
          monthlyRent?: {
            gte?: number;
            lte?: number;
          };
          city?: { equals: string; mode: "insensitive" };
          amenities?: { hasEvery: string[] };
        } = {
          isActive: true,
        };

        if (query) {
          where.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { address: { contains: query, mode: "insensitive" } },
          ];
        }

        if (priceMin !== undefined || priceMax !== undefined) {
          where.monthlyRent = {};
          if (priceMin !== undefined) where.monthlyRent.gte = priceMin;
          if (priceMax !== undefined) where.monthlyRent.lte = priceMax;
        }

        if (city) {
          where.city = { equals: city, mode: "insensitive" };
        }

        if (amenities && amenities.length > 0) {
          where.amenities = { hasEvery: amenities };
        }

        const [properties, total] = await Promise.all([
          ctx.db.property.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
              landlord: {
                select: {
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          }),
          ctx.db.property.count({ where }),
        ]);

        return {
          properties,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      }),

    // Get single property by ID (public)
    getById: publicProcedure
      .input(getPropertyByIdSchema)
      .query(async ({ ctx, input }: { ctx: TRPCContext; input: GetByIdInput }) => {
        const property = await ctx.db.property.findUnique({
          where: { id: input.id },
          include: {
            landlord: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    image: true,
                  },
                },
                businessName: true,
              },
            },
          },
        });

        if (!property) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Property not found",
          });
        }

        return property;
      }),

    // Get landlord's own properties
    getMyProperties: landlordProc.query(async ({ ctx }: LandlordCtx<void>) => {
      const landlordProfile = await ctx.db.landlordProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!landlordProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Landlord profile not found",
        });
      }

      return ctx.db.property.findMany({
        where: { landlordId: landlordProfile.id },
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { bookings: true },
          },
        },
      });
    }),

    // Create a new property
    create: landlordProc
      .input(createPropertySchema)
      .mutation(async ({ ctx, input }: LandlordCtx<CreatePropertyInput>) => {
        const landlordProfile = await ctx.db.landlordProfile.findUnique({
          where: { userId: ctx.session.user.id },
        });

        if (!landlordProfile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Landlord profile not found",
          });
        }

        return ctx.db.property.create({
          data: {
            ...input,
            landlordId: landlordProfile.id,
          },
        });
      }),

    // Update a property
    update: landlordProc
      .input(updatePropertySchema)
      .mutation(async ({ ctx, input }: LandlordCtx<UpdatePropertyInput>) => {
        const { id, ...data } = input;

        const landlordProfile = await ctx.db.landlordProfile.findUnique({
          where: { userId: ctx.session.user.id },
        });

        if (!landlordProfile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Landlord profile not found",
          });
        }

        // Verify ownership
        const property = await ctx.db.property.findFirst({
          where: { id, landlordId: landlordProfile.id },
        });

        if (!property) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Property not found or you don't have permission",
          });
        }

        return ctx.db.property.update({
          where: { id },
          data,
        });
      }),

    // Delete a property
    delete: landlordProc
      .input(deletePropertySchema)
      .mutation(async ({ ctx, input }: LandlordCtx<DeletePropertyInput>) => {
        const landlordProfile = await ctx.db.landlordProfile.findUnique({
          where: { userId: ctx.session.user.id },
        });

        if (!landlordProfile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Landlord profile not found",
          });
        }

        // Verify ownership
        const property = await ctx.db.property.findFirst({
          where: { id: input.id, landlordId: landlordProfile.id },
        });

        if (!property) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Property not found or you don't have permission",
          });
        }

        // Soft delete by setting isActive to false
        return ctx.db.property.update({
          where: { id: input.id },
          data: { isActive: false },
        });
      }),
  });
};
