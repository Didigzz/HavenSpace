import { Boarder } from '../../domain/entities/boarder.entity';
import { IBoarderRepository, BoarderFilters, BoarderStats } from '../../domain/repositories/boarder.repository.interface';
import { PrismaClientType } from '@havenspace/database';

export class PrismaBoarderRepository implements IBoarderRepository {
  constructor(private prisma: PrismaClientType) {}

  async findById(id: string): Promise<Boarder | null> {
    const boarderData = await this.prisma.boarder.findUnique({
      where: { id },
    });

    if (!boarderData) {
      return null;
    }

    return this.mapToDomain(boarderData);
  }

  async findByAccessCode(accessCode: string): Promise<Boarder | null> {
    const boarderData = await this.prisma.boarder.findFirst({
      where: { accessCode },
    });

    if (!boarderData) {
      return null;
    }

    return this.mapToDomain(boarderData);
  }

  async findAll(filters?: BoarderFilters): Promise<Boarder[]> {
    const boardersData = await this.prisma.boarder.findMany({
      where: {
        isActive: filters?.isActive,
        roomId: filters?.roomId,
        OR: filters?.search
          ? [
              { firstName: { contains: filters.search, mode: 'insensitive' } },
              { lastName: { contains: filters.search, mode: 'insensitive' } },
              { email: { contains: filters.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: {
        room: {
          select: { id: true, roomNumber: true, monthlyRate: true },
        },
        _count: {
          select: { payments: true },
        },
      },
      orderBy: { lastName: 'asc' },
    });

    return boardersData.map((boarder: unknown) => this.mapToDomain(boarder));
  }

  async save(boarder: Boarder): Promise<Boarder> {
    const boarderData = await this.prisma.boarder.upsert({
      where: { id: boarder.id },
      update: {
        firstName: boarder.firstName,
        lastName: boarder.lastName,
        email: boarder.email,
        phone: boarder.phone ?? null,
        emergencyContact: boarder.emergencyContact ?? null,
        emergencyPhone: boarder.emergencyPhone ?? null,
        accessCode: boarder.accessCode,
        moveInDate: boarder.moveInDate,
        moveOutDate: boarder.moveOutDate ?? null,
        isActive: boarder.isActive,
        roomId: boarder.roomId ?? null,
        updatedAt: boarder.updatedAt,
      },
      create: {
        id: boarder.id,
        firstName: boarder.firstName,
        lastName: boarder.lastName,
        email: boarder.email,
        phone: boarder.phone ?? null,
        emergencyContact: boarder.emergencyContact ?? null,
        emergencyPhone: boarder.emergencyPhone ?? null,
        accessCode: boarder.accessCode,
        moveInDate: boarder.moveInDate,
        moveOutDate: boarder.moveOutDate ?? null,
        isActive: boarder.isActive,
        roomId: boarder.roomId ?? null,
        createdAt: boarder.createdAt,
        updatedAt: boarder.updatedAt,
      },
    });

    return this.mapToDomain(boarderData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.boarder.delete({
      where: { id },
    });
  }

  async getStats(): Promise<BoarderStats> {
    const [total, active, inactive] = await Promise.all([
      this.prisma.boarder.count(),
      this.prisma.boarder.count({ where: { isActive: true } }),
      this.prisma.boarder.count({ where: { isActive: false } }),
    ]);

    return { total, active, inactive };
  }

  async existsByEmail(email: string, excludeId?: string): Promise<boolean> {
    const boarder = await this.prisma.boarder.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        id: excludeId ? { not: excludeId } : undefined,
      },
    });

    return boarder !== null;
  }

  private mapToDomain(data: unknown): Boarder {
    const d = data as {
      id: string;
      firstName: string;
      lastName: string;
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

    return new Boarder({
      id: d.id,
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phone: d.phone ?? undefined,
      emergencyContact: d.emergencyContact ?? undefined,
      emergencyPhone: d.emergencyPhone ?? undefined,
      accessCode: d.accessCode,
      moveInDate: d.moveInDate || new Date(),
      moveOutDate: d.moveOutDate ?? undefined,
      isActive: d.isActive,
      roomId: d.roomId ?? undefined,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    });
  }
}
