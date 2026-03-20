import { PrismaUtilityRepository } from './infrastructure/persistence/prisma-utility.repository';
import { UtilityService } from './domain/services/utility.service';
import { CreateUtilityReadingHandler } from './application/handlers/create-utility-reading.handler';
import { GetUtilityReadingHandler } from './application/handlers/get-utility-reading.handler';
import { ListUtilityReadingsHandler } from './application/handlers/list-utility-readings.handler';
import { GetLatestReadingHandler } from './application/handlers/get-latest-reading.handler';
import { GetConsumptionSummaryHandler } from './application/handlers/get-consumption-summary.handler';
import type { PrismaClientType } from '@havenspace/database';

export class UtilityModule {
  private static instance: UtilityModule;
  private repository: PrismaUtilityRepository;
  private service: UtilityService;
  private handlers: {
    createUtilityReading: CreateUtilityReadingHandler;
    getUtilityReading: GetUtilityReadingHandler;
    listUtilityReadings: ListUtilityReadingsHandler;
    getLatestReading: GetLatestReadingHandler;
    getConsumptionSummary: GetConsumptionSummaryHandler;
  };

  private constructor(db: PrismaClientType) {
    this.repository = new PrismaUtilityRepository(db);
    this.service = new UtilityService(this.repository);
    this.handlers = {
      createUtilityReading: new CreateUtilityReadingHandler(this.repository, this.service),
      getUtilityReading: new GetUtilityReadingHandler(this.repository),
      listUtilityReadings: new ListUtilityReadingsHandler(this.repository),
      getLatestReading: new GetLatestReadingHandler(this.repository),
      getConsumptionSummary: new GetConsumptionSummaryHandler(this.service),
    };
  }

  static initialize(db: PrismaClientType): UtilityModule {
    if (!UtilityModule.instance) {
      UtilityModule.instance = new UtilityModule(db);
    }
    return UtilityModule.instance;
  }

  static getInstance(): UtilityModule {
    if (!UtilityModule.instance) {
      throw new Error('UtilityModule not initialized. Call initialize() first.');
    }
    return UtilityModule.instance;
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