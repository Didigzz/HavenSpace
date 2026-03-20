import { Room } from '../domain/entities/room.entity';
import { RoomStats } from '../domain/repositories/room.repository.interface';

export interface IRoomApi {
  createRoom(data: Partial<Room>): Promise<Room>;
  updateRoom(id: string, data: Partial<Room>): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
  getRoomById(id: string): Promise<Room | null>;
  listRooms(filters?: unknown): Promise<Room[]>;
  getRoomStats(): Promise<RoomStats>;
}