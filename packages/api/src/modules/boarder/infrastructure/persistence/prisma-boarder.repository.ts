import { Boarder } from '../../domain/entities/boarder.entity';
import { IBoarderRepository, BoarderFilters, BoarderStats } from '../../domain/repositories/boarder.repository.interface';
import { PrismaClientType } from '@bhms/database';

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

    return boardersData.map((boarder: any) => this.mapToDomain(boarder));
  }

  async save(boarder: Boarder): Promise<Boarder> {
    const boarderData = await this.prisma.boarder.upsert({
      where: { id: boarder.id },
      update: {
        firstName: boarder.firstName,
        lastName: boarder.lastName,
        email: boarder.email,
        phone: boarder.phone,
        emergencyContact: boarder.emergencyContact,
        emergencyPhone: boarder.emergencyPhone,
        accessCode: boarder.accessCode,
        moveInDate: boarder.moveInDate,
        moveOutDate: boarder.moveOutDate,
        isActive: boarder.isActive,
        roomId: boarder.roomId,
        updatedAt: boarder.updatedAt,
      },
      create: {
        id: boarder.id,
        firstName: boarder.firstName,
        lastName: boarder.lastName,
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

  private mapToDomain(data: any): Boarder {
    return new Boarder({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      emergencyContact: data.emergencyContact,
      emergencyPhone: data.emergencyPhone,
      accessCode: data.accessCode,
      moveInDate: data.moveInDate,
      moveOutDate: data.moveOutDate,
      isActive: data.isActive,
      roomId: data.roomId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}