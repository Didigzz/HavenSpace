import { PrismaBoarderRepository } from './infrastructure/persistence/prisma-boarder.repository';
import { BoarderService } from './domain/services/boarder.service';
import { CreateBoarderHandler } from './application/handlers/create-boarder.handler';
import { UpdateBoarderHandler } from './application/handlers/update-boarder.handler';
import { DeleteBoarderHandler } from './application/handlers/delete-boarder.handler';
import { AssignRoomHandler } from './application/handlers/assign-room.handler';
import { GetBoarderHandler } from './application/handlers/get-boarder.handler';
import { ListBoardersHandler } from './application/handlers/list-boarders.handler';
import { GetBoarderStatsHandler } from './application/handlers/get-boarder-stats.handler';

export class BoarderModule {
  private static instance: BoarderModule;
  private repository: PrismaBoarderRepository;
  private service: BoarderService;
  private handlers: {
    createBoarder: CreateBoarderHandler;
    updateBoarder: UpdateBoarderHandler;
    deleteBoarder: DeleteBoarderHandler;
    assignRoom: AssignRoomHandler;
    getBoarder: GetBoarderHandler;
    listBoarders: ListBoardersHandler;
    getBoarderStats: GetBoarderStatsHandler;
  };

  private constructor(db: any) {
    this.repository = new PrismaBoarderRepository(db);
    this.service = new BoarderService(this.repository);
    this.handlers = {
      createBoarder: new CreateBoarderHandler(this.repository, this.service),
      updateBoarder: new UpdateBoarderHandler(this.repository, this.service),
      deleteBoarder: new DeleteBoarderHandler(this.repository),
      assignRoom: new AssignRoomHandler(this.repository, this.service),
      getBoarder: new GetBoarderHandler(this.repository),
      listBoarders: new ListBoardersHandler(this.repository),
      getBoarderStats: new GetBoarderStatsHandler(this.repository),
    };
  }

  static initialize(db: any): BoarderModule {
    if (!BoarderModule.instance) {
      BoarderModule.instance = new BoarderModule(db);
    }
    return BoarderModule.instance;
  }

  static getInstance(): BoarderModule {
    if (!BoarderModule.instance) {
      throw new Error('BoarderModule not initialized. Call initialize() first.');
    }
    return BoarderModule.instance;
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