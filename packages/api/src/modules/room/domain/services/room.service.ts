import { IRoomRepository } from '../repositories/room.repository.interface';

/**
 * Room Domain Service
 * Contains business logic that doesn't naturally fit in the entity
 */
export class RoomService {
  constructor(private roomRepository: IRoomRepository) {}

  /**
   * Check if a room can be assigned to a boarder
   */
  async canAssignBoarder(roomId: string, currentOccupancy: number): Promise<boolean> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      return false;
    }
    return room.isAvailable() && !room.isAtCapacity(currentOccupancy);
  }

  /**
   * Check if room number is unique
   */
  async isRoomNumberUnique(roomNumber: string, excludeId?: string): Promise<boolean> {
    return !(await this.roomRepository.existsByRoomNumber(roomNumber, excludeId));
  }

  /**
   * Validate room data before creation/update
   */
  validateRoomData(data: {
    roomNumber: string;
    floor: number;
    capacity: number;
    monthlyRate: number;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.roomNumber || data.roomNumber.trim().length === 0) {
      errors.push('Room number is required');
    }

    if (data.floor <= 0) {
      errors.push('Floor must be a positive number');
    }

    if (data.capacity <= 0) {
      errors.push('Capacity must be a positive number');
    }

    if (data.monthlyRate <= 0) {
      errors.push('Monthly rate must be a positive number');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}