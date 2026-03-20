import { IBoarderApi } from './boarder-api.interface';
import { BoarderModule } from '../boarder.module';
import { Boarder } from '../domain/entities/boarder.entity';
import { BoarderStats } from '../domain/repositories/boarder.repository.interface';
import type { CreateBoarderCommand } from '../application/commands/create-boarder.command';
import type { UpdateBoarderCommand } from '../application/commands/update-boarder.command';
import type { ListBoardersQuery } from '../application/queries/list-boarders.query';

export class BoarderApiFacade implements IBoarderApi {
  private static instance: BoarderApiFacade;

  private constructor() {}

  static getInstance(): BoarderApiFacade {
    if (!BoarderApiFacade.instance) {
      BoarderApiFacade.instance = new BoarderApiFacade();
    }
    return BoarderApiFacade.instance;
  }

  async createBoarder(data: CreateBoarderCommand): Promise<Boarder> {
    const module = BoarderModule.getInstance();
    return module.getHandlers().createBoarder.handle(data);
  }

  async updateBoarder(id: string, data: Omit<UpdateBoarderCommand, 'id'>): Promise<Boarder> {
    const module = BoarderModule.getInstance();
    return module.getHandlers().updateBoarder.handle({ id, ...data });
  }

  async deleteBoarder(id: string): Promise<void> {
    const module = BoarderModule.getInstance();
    await module.getHandlers().deleteBoarder.handle({ id });
  }

  async getBoarderById(id: string): Promise<Boarder | null> {
    const module = BoarderModule.getInstance();
    return module.getHandlers().getBoarder.handle({ id });
  }

  async listBoarders(filters?: ListBoardersQuery): Promise<Boarder[]> {
    const module = BoarderModule.getInstance();
    return module.getHandlers().listBoarders.handle(filters);
  }

  async assignRoom(boarderId: string, roomId: string | null): Promise<Boarder> {
    const module = BoarderModule.getInstance();
    return module.getHandlers().assignRoom.handle({ boarderId, roomId });
  }

  async getBoarderStats(): Promise<BoarderStats> {
    const module = BoarderModule.getInstance();
    return module.getHandlers().getBoarderStats.handle({});
  }
}