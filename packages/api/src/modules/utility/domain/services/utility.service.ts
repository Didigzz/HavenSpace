import { UtilityReading } from "../entities/utility-reading.entity";
import { IUtilityRepository } from "../repositories/utility.repository.interface";

export class UtilityService {
  constructor(private readonly repository: IUtilityRepository) {}

  async calculateConsumption(reading: UtilityReading): Promise<number> {
    return reading.consumption;
  }

  async calculateCost(reading: UtilityReading): Promise<number> {
    return reading.cost;
  }

  async getLatestReading(roomId: string, type: string): Promise<UtilityReading | null> {
    return this.repository.findLatestByRoomAndType(roomId, type);
  }

  async getConsumptionSummary(
    roomId?: string,
    type?: string,
    months: number = 6
  ): Promise<unknown[]> {
    return this.repository.findConsumptionSummary(roomId, type, months);
  }

  validateReading(reading: UtilityReading): void {
    if (reading.currentReading < reading.previousReading) {
      throw new Error("Current reading cannot be less than previous reading");
    }
  }

  async getConsumptionBetweenReadings(
    previousReadingId: string,
    currentReadingId: string
  ): Promise<number> {
    const previous = await this.repository.findById(previousReadingId);
    const current = await this.repository.findById(currentReadingId);

    if (!previous || !current) {
      throw new Error("One or both readings not found");
    }

    return current.currentReading - previous.previousReading;
  }
}