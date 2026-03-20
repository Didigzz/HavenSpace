import { IRoomApi } from './room-api.interface';
import { RoomModule } from '../room.module';
import { Room } from '../domain/entities/room.entity';
import { RoomStats } from '../domain/repositories/room.repository.interface';
import type { CreateRoomCommand } from '../application/commands/create-room.command';
import type { UpdateRoomCommand } from '../application/commands/update-room.command';
import type { ListRoomsQuery } from '../application/queries/list-rooms.query';

export class RoomApiFacade implements IRoomApi {
  private static instance: RoomApiFacade;

  private constructor() {}

  static getInstance(): RoomApiFacade {
    if (!RoomApiFacade.instance) {
      RoomApiFacade.instance = new RoomApiFacade();
    }
    return RoomApiFacade.instance;
  }

  async createRoom(data: Partial<Room>): Promise<Room> {
    const module = RoomModule.getInstance();
    return module.getHandlers().createRoom.handle(data as CreateRoomCommand);
  }

  async updateRoom(id: string, data: Partial<Room>): Promise<Room> {
    const module = RoomModule.getInstance();
    return module.getHandlers().updateRoom.handle({ id, ...data } as UpdateRoomCommand);
  }

  async deleteRoom(id: string): Promise<void> {
    const module = RoomModule.getInstance();
    await module.getHandlers().deleteRoom.handle({ id } as { id: string });
  }

  async getRoomById(id: string): Promise<Room | null> {
    const module = RoomModule.getInstance();
    return module.getHandlers().getRoom.handle({ id } as { id: string });
  }

  async listRooms(filters?: ListRoomsQuery): Promise<Room[]> {
    const module = RoomModule.getInstance();
    return module.getHandlers().listRooms.handle(filters as ListRoomsQuery);
  }

  async getRoomStats(): Promise<RoomStats> {
    const module = RoomModule.getInstance();
    return module.getHandlers().getRoomStats.handle({} as Record<string, never>);
  }
}