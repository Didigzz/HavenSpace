import { z } from 'zod';
import { PrismaBoarderRepository } from '../infrastructure/persistence/prisma-boarder.repository';
import { BoarderService } from '../domain/services/boarder.service';
import { CreateBoarderHandler } from '../application/handlers/create-boarder.handler';
import { UpdateBoarderHandler } from '../application/handlers/update-boarder.handler';
import { DeleteBoarderHandler } from '../application/handlers/delete-boarder.handler';
import { AssignRoomHandler } from '../application/handlers/assign-room.handler';
import { GetBoarderHandler } from '../application/handlers/get-boarder.handler';
import { ListBoardersHandler } from '../application/handlers/list-boarders.handler';
import { GetBoarderStatsHandler } from '../application/handlers/get-boarder-stats.handler';
import type { PrismaClientType } from '@havenspace/database';
import type { TRPCContext } from '../../../trpc';

type ProtectedProcedure = {
  input: (schema: z.ZodType) => {
    handler: (fn: (opts: { ctx: TRPCContext; input: unknown }) => Promise<unknown>) => unknown;
  };
  handler: (fn: (opts: { ctx: TRPCContext; input: unknown }) => Promise<unknown>) => unknown;
};

export const createBoarderRouter = (protectedProcedure: ProtectedProcedure) => {
  return {
    getAll: protectedProcedure
      .input(
        z
          .object({
            isActive: z.boolean().optional(),
            search: z.string().optional(),
            roomId: z.string().optional(),
          })
          .optional()
      )
      .handler(async ({ ctx, input }: { ctx: TRPCContext; input?: unknown }) => {
        const context = ctx as { db: PrismaClientType };
        // Initialize dependencies
        const boarderRepository = new PrismaBoarderRepository(context.db);
        const listBoardersHandler = new ListBoardersHandler(boarderRepository);

        // Execute query
        const boarders = await listBoardersHandler.handle(input as { isActive?: boolean; search?: string; roomId?: string } | undefined);

        // Convert to DTO format for response
        return boarders.map((boarder: unknown) => {
          const b = boarder as {
            id: string;
            firstName: string;
            lastName: string;
            fullName: string;
            email: string;
            phone?: string | null;
            emergencyContact?: string | null;
            emergencyPhone?: string | null;
            accessCode: string;
            moveInDate?: Date | null;
            moveOutDate?: Date | null;
            isActive: boolean;
            roomId?: string | null;
            createdAt: Date;
            updatedAt: Date;
          };

          return {
            id: b.id,
            firstName: b.firstName,
            lastName: b.lastName,
            fullName: b.fullName,
            email: b.email,
            phone: b.phone,
            emergencyContact: b.emergencyContact,
            emergencyPhone: b.emergencyPhone,
            accessCode: b.accessCode,
            moveInDate: b.moveInDate,
            moveOutDate: b.moveOutDate,
            isActive: b.isActive,
            roomId: b.roomId,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt,
          };
        });
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .handler(async ({ ctx, input }: { ctx: TRPCContext; input: unknown }) => {
        const context = ctx as { db: PrismaClientType };
        const inp = input as { id: string };
        // Initialize dependencies
        const boarderRepository = new PrismaBoarderRepository(context.db);
        const getBoarderHandler = new GetBoarderHandler(boarderRepository);

        // Execute query
        const boarder = await getBoarderHandler.handle(inp);

        if (!boarder) {
          return null;
        }

        // Convert to DTO format for response
        return {
          id: boarder.id,
          firstName: boarder.firstName,
          lastName: boarder.lastName,
          fullName: boarder.fullName,
          email: boarder.email,
          phone: boarder.phone,
          emergencyContact: boarder.emergencyContact,
          emergencyPhone: boarder.emergencyPhone,
          accessCode: boarder.accessCode,
          moveInDate: boarder.moveInDate,
          moveOutDate: boarder.moveOutDate,
          isActive: boarder.isActive,
          roomId: boarder.roomId,
          createdAt: boarder.createdAt,
          updatedAt: boarder.updatedAt,
        };
      }),

    create: protectedProcedure
      .input(
        z.object({
          firstName: z.string().min(1, "First name is required"),
          lastName: z.string().min(1, "Last name is required"),
          email: z.string().email("Invalid email address"),
          phone: z.string().optional(),
          emergencyContact: z.string().optional(),
          emergencyPhone: z.string().optional(),
          moveInDate: z.date(),
          roomId: z.string().optional(),
        })
      )
      .handler(async ({ ctx, input }: { ctx: TRPCContext; input: unknown }) => {
        const context = ctx as { db: PrismaClientType };
        const inp = input as {
          firstName: string;
          lastName: string;
          email: string;
          phone?: string;
          emergencyContact?: string;
          emergencyPhone?: string;
          moveInDate: Date;
          roomId?: string;
        };

        // Initialize dependencies
        const boarderRepository = new PrismaBoarderRepository(context.db);
        const boarderService = new BoarderService(boarderRepository);
        const createBoarderHandler = new CreateBoarderHandler(boarderRepository, boarderService);

        // Execute command
        const boarder = await createBoarderHandler.handle(inp);

        // Update room status if assigned
        if (inp.roomId) {
          const room = await context.db.room.findUnique({
            where: { id: inp.roomId },
            include: { _count: { select: { boarders: { where: { isActive: true } } } } },
          });

          if (room && room._count.boarders >= room.capacity) {
            await context.db.room.update({
              where: { id: inp.roomId },
              data: { status: 'OCCUPIED' },
            });
          }
        }

        // Convert to DTO format for response
        return {
          id: boarder.id,
          firstName: boarder.firstName,
          lastName: boarder.lastName,
          fullName: boarder.fullName,
          email: boarder.email,
          phone: boarder.phone,
          emergencyContact: boarder.emergencyContact,
          emergencyPhone: boarder.emergencyPhone,
          accessCode: boarder.accessCode,
          moveInDate: boarder.moveInDate,
          moveOutDate: boarder.moveOutDate,
          isActive: boarder.isActive,
          roomId: boarder.roomId,
          createdAt: boarder.createdAt,
          updatedAt: boarder.updatedAt,
        };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          firstName: z.string().min(1).optional(),
          lastName: z.string().min(1).optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          emergencyContact: z.string().optional(),
          emergencyPhone: z.string().optional(),
          moveInDate: z.date().optional(),
          moveOutDate: z.date().optional(),
          isActive: z.boolean().optional(),
          roomId: z.string().optional(),
        })
      )
      .handler(async ({ ctx, input }: { ctx: TRPCContext; input: unknown }) => {
        const context = ctx as { db: PrismaClientType };
        // Initialize dependencies
        const boarderRepository = new PrismaBoarderRepository(context.db);
        const boarderService = new BoarderService(boarderRepository);
        const updateBoarderHandler = new UpdateBoarderHandler(boarderRepository, boarderService);

        // Execute command
        const boarder = await updateBoarderHandler.handle(input as { id: string; firstName?: string; lastName?: string; email?: string; phone?: string; emergencyContact?: string; emergencyPhone?: string; moveInDate?: Date; moveOutDate?: Date; isActive?: boolean; roomId?: string });

        // Convert to DTO format for response
        return {
          id: boarder.id,
          firstName: boarder.firstName,
          lastName: boarder.lastName,
          fullName: boarder.fullName,
          email: boarder.email,
          phone: boarder.phone,
          emergencyContact: boarder.emergencyContact,
          emergencyPhone: boarder.emergencyPhone,
          accessCode: boarder.accessCode,
          moveInDate: boarder.moveInDate,
          moveOutDate: boarder.moveOutDate,
          isActive: boarder.isActive,
          roomId: boarder.roomId,
          createdAt: boarder.createdAt,
          updatedAt: boarder.updatedAt,
        };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .handler(async ({ ctx, input }: { ctx: TRPCContext; input: unknown }) => {
        const context = ctx as { db: PrismaClientType };
        const inp = input as { id: string };
        // Initialize dependencies
        const boarderRepository = new PrismaBoarderRepository(context.db);
        const deleteBoarderHandler = new DeleteBoarderHandler(boarderRepository);

        // Execute command
        await deleteBoarderHandler.handle(inp);

        return { success: true };
      }),

    assignRoom: protectedProcedure
      .input(
        z.object({
          boarderId: z.string(),
          roomId: z.string().nullable(),
        })
      )
      .handler(async ({ ctx, input }: { ctx: TRPCContext; input: unknown }) => {
        const context = ctx as { db: PrismaClientType };
        const inp = input as { boarderId: string; roomId: string | null };

        // Initialize dependencies
        const boarderRepository = new PrismaBoarderRepository(context.db);
        const boarderService = new BoarderService(boarderRepository);
        const assignRoomHandler = new AssignRoomHandler(boarderRepository, boarderService);

        // Execute command
        const boarder = await assignRoomHandler.handle(inp);

        // Update room statuses
        if (inp.roomId) {
          const room = await context.db.room.findUnique({
            where: { id: inp.roomId },
            include: { _count: { select: { boarders: { where: { isActive: true } } } } },
          });

          if (room && room._count.boarders >= room.capacity) {
            await context.db.room.update({
              where: { id: inp.roomId },
              data: { status: 'OCCUPIED' },
            });
          }
        }

        // Convert to DTO format for response
        return {
          id: boarder.id,
          firstName: boarder.firstName,
          lastName: boarder.lastName,
          fullName: boarder.fullName,
          email: boarder.email,
          phone: boarder.phone,
          emergencyContact: boarder.emergencyContact,
          emergencyPhone: boarder.emergencyPhone,
          accessCode: boarder.accessCode,
          moveInDate: boarder.moveInDate,
          moveOutDate: boarder.moveOutDate,
          isActive: boarder.isActive,
          roomId: boarder.roomId,
          createdAt: boarder.createdAt,
          updatedAt: boarder.updatedAt,
        };
      }),

    getStats: protectedProcedure.handler(async ({ ctx }: { ctx: TRPCContext }) => {
      const context = ctx as { db: PrismaClientType };
      // Initialize dependencies
      const boarderRepository = new PrismaBoarderRepository(context.db);
      const getBoarderStatsHandler = new GetBoarderStatsHandler(boarderRepository);

      // Execute query
      const stats = await getBoarderStatsHandler.handle({});

      return stats;
    }),
  };
};