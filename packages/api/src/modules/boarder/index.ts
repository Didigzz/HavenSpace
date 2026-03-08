// Domain Layer
export { Boarder } from './domain/entities/boarder.entity';
export type { IBoarderRepository, BoarderFilters, BoarderStats } from './domain/repositories/boarder.repository.interface';
export { BoarderService } from './domain/services/boarder.service';

// Application Layer
export type { CreateBoarderCommand } from './application/commands/create-boarder.command';
export { CreateBoarderCommandSchema } from './application/commands/create-boarder.command';
export type { UpdateBoarderCommand } from './application/commands/update-boarder.command';
export { UpdateBoarderCommandSchema } from './application/commands/update-boarder.command';
export type { DeleteBoarderCommand } from './application/commands/delete-boarder.command';
export { DeleteBoarderCommandSchema } from './application/commands/delete-boarder.command';
export type { AssignRoomCommand } from './application/commands/assign-room.command';
export { AssignRoomCommandSchema } from './application/commands/assign-room.command';
export type { GetBoarderQuery } from './application/queries/get-boarder.query';
export { GetBoarderQuerySchema } from './application/queries/get-boarder.query';
export type { ListBoardersQuery } from './application/queries/list-boarders.query';
export { ListBoardersQuerySchema } from './application/queries/list-boarders.query';
export type { GetBoarderStatsQuery } from './application/queries/get-boarder-stats.query';
export { CreateBoarderHandler } from './application/handlers/create-boarder.handler';
export { UpdateBoarderHandler } from './application/handlers/update-boarder.handler';
export { DeleteBoarderHandler } from './application/handlers/delete-boarder.handler';
export { AssignRoomHandler } from './application/handlers/assign-room.handler';
export { GetBoarderHandler } from './application/handlers/get-boarder.handler';
export { ListBoardersHandler } from './application/handlers/list-boarders.handler';
export { GetBoarderStatsHandler } from './application/handlers/get-boarder-stats.handler';

// Infrastructure Layer
export { PrismaBoarderRepository } from './infrastructure/persistence/prisma-boarder.repository';
export {
  BoarderCreatedEvent,
  BoarderUpdatedEvent,
  BoarderDeletedEvent,
  BoarderDeactivatedEvent,
  BoarderReactivatedEvent,
  RoomAssignedEvent,
  RoomRemovedEvent,
  AccessCodeRegeneratedEvent,
} from './infrastructure/events/boarder-events';

// Presentation Layer
export { createBoarderRouter } from './presentation/boarder.router';
export { BoarderModule } from './boarder.module';
export * from './domain/events';
export * from './integration-events';
export * from './api';