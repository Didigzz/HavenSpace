import { IUtilityRepository } from "../../domain/repositories/utility.repository.interface";
import { UtilityReading } from "../../domain/entities/utility-reading.entity";
import type { PrismaClientType } from "@havenspace/database";
import { UtilityType } from "../../domain/value-objects/utility-type.vo";

export class PrismaUtilityRepository implements IUtilityRepository {
  constructor(private readonly db: PrismaClientType) {}

  async findById(id: string): Promise<UtilityReading | null> {
    const data = await this.db.utilityReading.findUnique({
      where: { id },
      include: { room: true },
    });

    return data ? UtilityReading.fromPrisma(data) : null;
  }

  async findByRoomId(roomId: string): Promise<UtilityReading[]> {
    const data = await this.db.utilityReading.findMany({
      where: { roomId },
      orderBy: { readingDate: "desc" },
    });

    return data.map((item: unknown) => UtilityReading.fromPrisma(item));
  }

  async findByType(type: string): Promise<UtilityReading[]> {
    const data = await this.db.utilityReading.findMany({
      where: { type: type as "ELECTRICITY" | "WATER" | "INTERNET" | "OTHER" },
      orderBy: { readingDate: "desc" },
    });

    return data.map((item: unknown) => UtilityReading.fromPrisma(item));
  }

  async findByRoomAndType(roomId: string, type: string): Promise<UtilityReading[]> {
    const data = await this.db.utilityReading.findMany({
      where: { roomId, type: type as "ELECTRICITY" | "WATER" | "INTERNET" | "OTHER" },
      orderBy: { readingDate: "desc" },
    });

    return data.map((item: unknown) => UtilityReading.fromPrisma(item));
  }

  async findLatestByRoomAndType(
    roomId: string,
    type: string
  ): Promise<UtilityReading | null> {
    const data = await this.db.utilityReading.findFirst({
      where: { roomId, type: type as "ELECTRICITY" | "WATER" | "INTERNET" | "OTHER" },
      orderBy: { readingDate: "desc" },
    });

    return data ? UtilityReading.fromPrisma(data) : null;
  }

  async findConsumptionSummary(
    roomId?: string,
    type?: string,
    months: number = 6
  ): Promise<unknown[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const readings = await this.db.utilityReading.findMany({
      where: {
        roomId,
        type: type as "ELECTRICITY" | "WATER" | "INTERNET" | "OTHER" | undefined,
        readingDate: { gte: startDate },
      },
      include: { room: { select: { roomNumber: true } } },
      orderBy: { readingDate: "asc" },
    });

    return readings.map((reading: unknown) => {
      const r = reading as {
        id: string;
        room: { roomNumber: string };
        type: string;
        previousReading: number | string;
        currentReading: number | string;
        ratePerUnit: number | string;
        readingDate: Date;
      };

      return {
        id: r.id,
        room: r.room.roomNumber,
        type: r.type,
        consumption: Number(r.currentReading) - Number(r.previousReading),
        cost:
          (Number(r.currentReading) - Number(r.previousReading)) *
          Number(r.ratePerUnit),
        date: r.readingDate,
      };
    });
  }

  async findAll(filters?: {
    type?: string;
    roomId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<UtilityReading[]> {
    const data = await this.db.utilityReading.findMany({
      where: {
        type: filters?.type as "ELECTRICITY" | "WATER" | "INTERNET" | "OTHER" | undefined,
        roomId: filters?.roomId,
        readingDate: {
          gte: filters?.startDate,
          lte: filters?.endDate,
        },
      },
      include: {
        room: {
          select: { id: true, roomNumber: true },
        },
      },
      orderBy: { readingDate: "desc" },
    });

    return data.map((item: unknown) => UtilityReading.fromPrisma(item));
  }

  async save(reading: UtilityReading): Promise<UtilityReading> {
    const prismaData = reading.toPrisma();
    const data = await this.db.utilityReading.create({
      data: {
        ...prismaData,
        type: prismaData.type as "ELECTRICITY" | "WATER" | "INTERNET" | "OTHER",
      },
    });

    return UtilityReading.fromPrisma(data);
  }

  async update(id: string, data: Partial<UtilityReading>): Promise<UtilityReading> {
    const prismaData = data.toPrisma ? data.toPrisma() : data;
    const updated = await this.db.utilityReading.update({
      where: { id },
      data: {
        ...prismaData,
        type: prismaData.type ? (prismaData.type as "ELECTRICITY" | "WATER" | "INTERNET" | "OTHER") : undefined,
        roomId: prismaData.roomId ?? undefined,
      },
    });

    return UtilityReading.fromPrisma(updated);
  }

  async delete(id: string): Promise<void> {
    await this.db.utilityReading.delete({
      where: { id },
    });
  }
}