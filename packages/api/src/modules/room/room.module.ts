import { PrismaRoomRepository } from './infrastructure/persistence/prisma-room.repository';
import { RoomService } from './domain/services/room.service';
import { CreateRoomHandler } from './application/handlers/create-room.handler';
import { UpdateRoomHandler } from './application/handlers/update-room.handler';
import { DeleteRoomHandler } from './application/handlers/delete-room.handler';
import { GetRoomHandler } from './application/handlers/get-room.handler';
import { ListRoomsHandler } from './application/handlers/list-rooms.handler';
import { GetRoomStatsHandler } from './application/handlers/get-room-stats.handler';
import type { PrismaClientType } from '@havenspace/database';

export class RoomModule {
  private static instance: RoomModule;
  private repository: PrismaRoomRepository;
  private service: RoomService;
  private handlers: {
    createRoom: CreateRoomHandler;
    updateRoom: UpdateRoomHandler;
    deleteRoom: DeleteRoomHandler;
    getRoom: GetRoomHandler;
    listRooms: ListRoomsHandler;
    getRoomStats: GetRoomStatsHandler;
  };

  private constructor(db: PrismaClientType) {
    this.repository = new PrismaRoomRepository(db);
    this.service = new RoomService(this.repository);
    this.handlers = {
      createRoom: new CreateRoomHandler(this.repository, this.service),
      updateRoom: new UpdateRoomHandler(this.repository, this.service),
      deleteRoom: new DeleteRoomHandler(this.repository),
      getRoom: new GetRoomHandler(this.repository),
      listRooms: new ListRoomsHandler(this.repository),
      getRoomStats: new GetRoomStatsHandler(this.repository),
    };
  }

  static initialize(db: PrismaClientType): RoomModule {
    if (!RoomModule.instance) {
      RoomModule.instance = new RoomModule(db);
    }
    return RoomModule.instance;
  }

  static getInstance(): RoomModule {
    if (!RoomModule.instance) {
      throw new Error('RoomModule not initialized. Call initialize() first.');
    }
    return RoomModule.instance;
  }

  getHandlers() {
    return this.handlers;
  }

  getRepository() {
    return this.repository;
  }

  getService() {
    return this.service;
  }

  async dispose(): Promise<void> {
    // Cleanup resources if needed
  }
}