import { UtilityReading } from "../entities/utility-reading.entity";

export interface IUtilityRepository {
  findById(id: string): Promise<UtilityReading | null>;
  findByRoomId(roomId: string): Promise<UtilityReading[]>;
  findByType(type: string): Promise<UtilityReading[]>;
  findByRoomAndType(roomId: string, type: string): Promise<UtilityReading[]>;
  findLatestByRoomAndType(roomId: string, type: string): Promise<UtilityReading | null>;
  findConsumptionSummary(
    roomId?: string,
    type?: string,
    months?: number
  ): Promise<unknown[]>;
  findAll(filters?: {
    type?: string;
    roomId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<UtilityReading[]>;
  save(reading: UtilityReading): Promise<UtilityReading>;
  update(id: string, data: Partial<UtilityReading>): Promise<UtilityReading>;
  delete(id: string): Promise<void>;
}