import { Room } from '../../domain/entities/room.entity';
import { RoomStatus } from '../../domain/value-objects/room-status.vo';
import { IRoomRepository, RoomFilters, RoomStats } from '../../domain/repositories/room.repository.interface';
import type { PrismaClientType } from '@havenspace/database';
import { Prisma } from '@prisma/client';

interface RoomData {
  id: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  monthlyRate: Prisma.Decimal | number;
  description: string | null;
  amenities: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PrismaRoomRepository implements IRoomRepository {
  constructor(private prisma: PrismaClientType) {}

  async findById(id: string): Promise<Room | null> {
    const roomData = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!roomData) {
      return null;
    }

    return this.mapToDomain(roomData);
  }

  async findAll(filters?: RoomFilters): Promise<Room[]> {
    const roomsData = await this.prisma.room.findMany({
      where: {
        status: filters?.status ? filters.status.value : undefined,
        roomNumber: filters?.search
          ? { contains: filters.search, mode: 'insensitive' }
          : undefined,
        floor: filters?.floor,
      },
      include: {
        boarders: {
          where: { isActive: true },
          select: { id: true, firstName: true, lastName: true },
        },
        _count: {
          select: { boarders: { where: { isActive: true } } },
        },
      },
      orderBy: { roomNumber: 'asc' },
    });

    return roomsData.map((room) => this.mapToDomain(room));
  }

  async save(room: Room): Promise<Room> {
    const roomData = await this.prisma.room.upsert({
      where: { id: room.id },
      update: {
        roomNumber: room.roomNumber,
        floor: room.floor,
        capacity: room.capacity,
        monthlyRate: room.monthlyRate,
        description: room.description ?? null,
        amenities: room.amenities,
        status: room.status.value,
        updatedAt: room.updatedAt,
      },
      create: {
        id: room.id,
        roomNumber: room.roomNumber,
        floor: room.floor,
        capacity: room.capacity,
        monthlyRate: room.monthlyRate,
        description: room.description ?? null,
        amenities: room.amenities,
        status: room.status.value,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      },
    });

    return this.mapToDomain(roomData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.room.delete({
      where: { id },
    });
  }

  async getStats(): Promise<RoomStats> {
    const [total, available, occupied, maintenance] = await Promise.all([
      this.prisma.room.count(),
      this.prisma.room.count({ where: { status: 'AVAILABLE' } }),
      this.prisma.room.count({ where: { status: 'OCCUPIED' } }),
      this.prisma.room.count({ where: { status: 'MAINTENANCE' } }),
    ]);

    return { total, available, occupied, maintenance };
  }

  async existsByRoomNumber(roomNumber: string, excludeId?: string): Promise<boolean> {
    const room = await this.prisma.room.findFirst({
      where: {
        roomNumber: {
          equals: roomNumber,
          mode: 'insensitive',
        },
        id: excludeId ? { not: excludeId } : undefined,
      },
    });

    return room !== null;
  }

  private mapToDomain(data: RoomData): Room {
    return new Room({
      id: data.id,
      roomNumber: data.roomNumber,
      floor: data.floor,
      capacity: data.capacity,
      monthlyRate: data.monthlyRate instanceof Prisma.Decimal ? data.monthlyRate.toNumber() : data.monthlyRate,
      description: data.description ?? undefined,
      amenities: data.amenities,
      status: RoomStatus.fromString(data.status),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
